import React, { useEffect, useRef, useState } from 'react';

export default function LoginModal({ open, onClose, onSubmit }) {
    const overlayRef = useRef(null);
    const emailRef = useRef(null);
    const firstTrapRef = useRef(null);
    const lastTrapRef = useRef(null);
    const formRef = useRef(null);

    const [errors, setErrors] = useState({ email: "", password: "" });

    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") {
                e.stopPropagation();
                safeClose(e);
            }
            if (e.key === "Tab" && open) {
                const focusable = getFocusable();
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        if (open) {
            document.addEventListener("keydown", onKeyDown);
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            setTimeout(() => emailRef.current?.focus(), 0);
            return () => {
                document.removeEventListener("keydown", onKeyDown);
                document.body.style.overflow = prev;
            };
        }
    }, [open]);

    function getFocusable() {
        const root = overlayRef.current;
        if (!root) return [];
        return Array.from(
            root.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
        ).filter((el) => !el.hasAttribute("disabled"));
    }

    function onOverlayClick(e) {
        if (e.target === overlayRef.current) {
            safeClose(e);
        }
    }

    async function safeClose(e) {
        if (typeof onClose === "function") {
            if (e) e.preventDefault();
            onClose();
        }
    }
    
    function validate(payload) {
        let newErrors = { email: "", password: "" };
        let valid = true;

        if (!payload.email) {
            newErrors.email = "Ange e-post adress.";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            newErrors.email = "Ange en giltig e-post adress.";
            valid = false;
        }

        if (!payload.password) {
            newErrors.password = "Ange Lösenord.";
            valid = false;
        } else if (payload.password.length < 6) {
            newErrors.password = "Lösenordet måsta vara minst 6 tecken långt.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const payload = {
            email: String(formData.get("email") || "").trim(),
            password: String(formData.get("password") || ""),
            remember: Boolean(formData.get("remember")),
        };

        if (!validate(payload)) return;

        try {
            await onSubmit?.(payload);
        } catch (err) {
            console.error("Login Failed", err);
        }
    }


    

    return !open? null : (
        <div
            ref={overlayRef}
            className="lm-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            onMouseDown={onOverlayClick}
        >
            <span ref={firstTrapRef} tabIndex="0" aria-hidden="true" />

            <div className="lm-dialog" role="document">
                <header className="lm-header">
                    <h2 id="login-title" className="lm-title">Sign in</h2>
                    <button className="lm-close" aria-label="Close" onClick={safeClose} type="button">×</button>
                </header>

                <form noValidate ref={formRef} className="lm-form" onSubmit={handleSubmit}>
                    <div className="lm-field">
                        <label htmlFor="email">Email</label>
                        <input
                            ref={emailRef}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                        />
                        {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>

                    <div className="lm-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                        {errors.password && <p className="form-error">{errors.password}</p>}
                    </div>

                    <div className="lm-row">
                        <label className="lm-remember">
                            <input type="checkbox" name="remember" />
                            Remember me
                        </label>
                        <a className="lm-link" href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
                    </div>

                    <button className="lm-submit" type="submit">Sign in</button>

                </form>
            </div>

            <span ref={lastTrapRef} tabIndex="0" aria-hidden="true" />
        </div>
    );
}
