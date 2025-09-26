import React, { useEffect, useRef, useState } from 'react';
import TermsOfUse from '../TermsOfUse';

export default function LoginModal({ open, onClose, onSubmit }) {
    const overlayRef = useRef(null);
    const emailRef = useRef(null);
    const firstTrapRef = useRef(null);
    const lastTrapRef = useRef(null);
    const formRef = useRef(null);

    const [errors, setErrors] = useState({ email: "", password: "" });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

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
      setFormError("");     // nollställ vid öppning
      setErrors({ email: "", password: "" });
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
      newErrors.email = "Ange e-postadress.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      newErrors.email = "Ange en giltig e-postadress.";
      valid = false;
    }

    if (!payload.password) {
      newErrors.password = "Ange lösenord.";
      valid = false;
    } else if (payload.password.length < 6) {
      newErrors.password = "Lösenordet måste vara minst 6 tecken.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    const formData = new FormData(formRef.current);
    const payload = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
      remember: Boolean(formData.get("remember")),
    };

    if (!validate(payload)) return;

    try {
      setSubmitting(true);
      await onSubmit?.(payload);
      // onSubmit stänger modalen vid lyckad inloggning
    } catch (err) {

      const status = err?.response?.status ?? err?.status;
      if (status === 404) {
        setFormError("Användare finns inte.");
        emailRef.current?.focus();
      } else if (status === 401) {
        setFormError("Fel e-post eller lösenord.");
      } else {
        setFormError("Det gick inte att logga in just nu. Försök igen senare.");
      }
      console.error("Login failed:", err);
    } finally {
      setSubmitting(false);
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
          {/* Övergripande fel från backend */}
          {formError && (
            <div
              className="form-error mb-3"
              role="alert"
              aria-live="assertive"
            >
              {formError}
            </div>
          )}

          <div className="lm-field">
            <label htmlFor="email">Email</label>
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={submitting}
            />
            {errors.email && <p id="email-error" className="form-error">{errors.email}</p>}
          </div>

          <div className="lm-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={submitting}
            />
            {errors.password && <p id="password-error" className="form-error">{errors.password}</p>}
          </div>

          <div className="lm-row">
            <label className="lm-remember">
              <input type="checkbox" name="remember" disabled={submitting} />
              Remember me
            </label>
            <a className="lm-link" href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
          </div>

          <button className="lm-submit" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Sign in"}
          </button>

          <TermsOfUse />
        </form>
      </div>

      <span ref={lastTrapRef} tabIndex="0" aria-hidden="true" />
    </div>
    );
}
