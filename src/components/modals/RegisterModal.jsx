import React, { useEffect, useRef, useState } from 'react';

export default function RegisterModal({ open, onClose, onSubmit }) {
  const overlayRef = useRef(null);
  const emailRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (open) {
      setErr('');
      setSubmitting(false);
      setTimeout(() => emailRef.current?.focus(), 0);
      const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  function onOverlayClick(e) {
    if (e.target === overlayRef.current) onClose?.();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');

    const form = new FormData(e.currentTarget);
    const firstName = form.get('firstName')?.toString().trim();
    const lastName  = form.get('lastName')?.toString().trim();
    const email     = form.get('email')?.toString().trim();
    const phone     = form.get('phone')?.toString().trim();
    const password  = form.get('password')?.toString();
    const confirm   = form.get('confirm')?.toString();

    if (!firstName || !lastName) return setErr('För- och efternamn krävs.');
    if (!email) return setErr('Email krävs.');
    if (!phone) return setErr('Telefonnummer krävs.');
    if (!password) return setErr('Lösenord krävs.');
    if (password.length < 8) return setErr('Minst 8 tecken i lösenord.');
    if (password !== confirm) return setErr('Lösenorden matchar inte.');

    try {
      setSubmitting(true);
      // Dont send the role field to the onSubmit function as we dont want users to be able to set their own role.
      await onSubmit?.({ firstName, lastName, email, phone, password });
    } catch (ex) {
      setErr(ex?.message || 'Något gick fel, försök igen.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      className="rm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
      onMouseDown={onOverlayClick}
    >
      <div className="rm-dialog" role="document">
        <header className="rm-header">
          <h2 id="register-title" className="rm-title">Create your account</h2>
          <button className="rm-close" aria-label="Close" onClick={onClose} type="button">×</button>
        </header>

        {err && <div role="alert" className="rm-error">{err}</div>}

        <form noValidate className="rm-form" onSubmit={handleSubmit}>
          <div className="rm-row-2">
            <div className="rm-field">
              <label htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" type="text" required placeholder="Jane" />
            </div>
            <div className="rm-field">
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" type="text" required placeholder="Doe" />
            </div>
          </div>

          <div className="rm-field">
            <label htmlFor="email">Email</label>
            <input ref={emailRef} id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>

          <div className="rm-field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" required placeholder="+46 70 123 45 67" />
          </div>

          <div className="rm-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required placeholder="••••••••" minLength={8} />
          </div>

          <div className="rm-field">
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" name="confirm" type="password" required placeholder="••••••••" minLength={8} />
          </div>

          <div className="rm-actions">
            <button type="button" className="rm-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="rm-submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
