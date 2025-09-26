import React, { useEffect, useRef, useState } from 'react';
import TermsOfUse from '../TermsOfUse';

export default function RegisterModal({ open, onClose, onSubmit }) {
  const overlayRef = useRef(null);
  const emailRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirm: ''
  });
  const [errors, setErrors] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirm: ''
  });
  const [touched, setTouched] = useState({
    firstName: false, lastName: false, email: false, phone: false,
    password: false, confirm: false
  });

  useEffect(() => {
    if (!open) return;

    setSubmitting(false);
    setTouched({ firstName:false,lastName:false,email:false,phone:false,password:false,confirm:false });
    setErrors({ firstName:'',lastName:'',email:'',phone:'',password:'',confirm:'' });

    setTimeout(() => emailRef.current?.focus(), 0);
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // --- Validators ---
  const isName = (s) => /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/.test(s || '');
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((s || '').trim());
  const normalizePhone = (s) => (s || '').replace(/[()\s-]/g, '');
  const isSwedishPhone = (sRaw) => {
    const s = normalizePhone(sRaw);
    return /^(?:\+46[1-9]\d{7,10}|0[1-9]\d{7,10})$/.test(s);
  };
  const pwChecks = {
    len: (s) => (s || '').length >= 8,
    upper: (s) => /[A-Z]/.test(s || ''),
    lower: (s) => /[a-z]/.test(s || ''),
    digit: (s) => /\d/.test(s || ''),
    special: (s) => /[^A-Za-z0-9]/.test(s || ''),
  };
  const validatePassword = (s) => {
    if (!pwChecks.len(s)) return 'Minst 8 tecken.';
    if (!pwChecks.upper(s)) return 'Minst 1 versal (A–Z).';
    if (!pwChecks.lower(s)) return 'Minst 1 gemen (a–z).';
    if (!pwChecks.digit(s)) return 'Minst 1 siffra.';
    if (!pwChecks.special(s)) return 'Minst 1 specialtecken.';
    return '';
  };
  const validateField = (name, value, allValues) => {
    switch (name) {
      case 'firstName': if (!value) return 'Förnamn krävs.'; if (!isName(value)) return 'Ogiltigt förnamn.'; return '';
      case 'lastName':  if (!value) return 'Efternamn krävs.'; if (!isName(value)) return 'Ogiltigt efternamn.'; return '';
      case 'email':     if (!value) return 'Email krävs.'; if (!isEmail(value)) return 'Ogiltig email.'; return '';
      case 'phone':     if (!value) return 'Telefonnummer krävs.'; if (!isSwedishPhone(value)) return 'Ogiltigt svenskt nummer. Ex: +46701234567 eller 0701234567'; return '';
      case 'password':  if (!value) return 'Lösenord krävs.'; return validatePassword(value);
      case 'confirm':   if (!value) return 'Bekräfta lösenord.'; if (value !== allValues.password) return 'Lösenorden matchar inte.'; return '';
      default: return '';
    }
  };
  const validateAll = (vals) => {
    const next = {};
    for (const k of Object.keys(vals)) next[k] = validateField(k, vals[k], vals);
    return next;
  };

  const allErrorsIfNow = validateAll(values);
  const allValid = Object.values(allErrorsIfNow).every(e => !e);
  const summaryError =
    errors.firstName || errors.lastName || errors.email ||
    errors.phone || errors.password || errors.confirm || '';

  // --- Handlers --- fully genereted with chatgpt 5
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: validateField(name, value, { ...values, [name]: value }) }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(errs => ({ ...errs, [name]: validateField(name, values[name], values) }));
    if (name === 'password' && touched.confirm) {
      setErrors(errs => ({ ...errs, confirm: validateField('confirm', values.confirm, values) }));
    }
  };
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ firstName:true,lastName:true,email:true,phone:true,password:true,confirm:true });
    const currentErrors = validateAll(values);
    setErrors(currentErrors);
    if (!Object.values(currentErrors).every(x => !x)) return;

    try {
      setSubmitting(true);
      const { firstName, lastName, email, phone, password } = values;
      await onSubmit?.({ firstName, lastName, email: email.trim(), phone: normalizePhone(phone), password });
    } finally {
      setSubmitting(false);
    }
  }

  // --- Render ---
  return !open ? null : (
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

        {summaryError && <div role="alert" className="form-error">{summaryError}</div>}

        <form noValidate className="rm-form" onSubmit={handleSubmit}>
          <div className="rm-row-2">
            <div className="rm-field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName" name="firstName" type="text" required placeholder="Jane"
                value={values.firstName} onChange={handleChange} onBlur={handleBlur}
                aria-invalid={!!errors.firstName} aria-describedby="firstName-error"
              />
              {touched.firstName && errors.firstName && <p id="firstName-error" className="form-error">{errors.firstName}</p>}
            </div>
            <div className="rm-field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName" name="lastName" type="text" required placeholder="Doe"
                value={values.lastName} onChange={handleChange} onBlur={handleBlur}
                aria-invalid={!!errors.lastName} aria-describedby="lastName-error"
              />
              {touched.lastName && errors.lastName && <p id="lastName-error" className="form-error">{errors.lastName}</p>}
            </div>
          </div>

          <div className="rm-field">
            <label htmlFor="email">Email</label>
            <input
              ref={emailRef}
              id="email" name="email" type="email" required placeholder="you@example.com"
              value={values.email} onChange={handleChange} onBlur={handleBlur}
              autoComplete="email"
              aria-invalid={!!errors.email} aria-describedby="email-error"
            />
            {touched.email && errors.email && <p id="email-error" className="form-error">{errors.email}</p>}
          </div>

          <div className="rm-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone" name="phone" type="tel" required placeholder="+46 70 123 45 67"
              value={values.phone} onChange={handleChange} onBlur={handleBlur}
              inputMode="tel" autoComplete="tel"
              aria-invalid={!!errors.phone} aria-describedby="phone-error"
            />
            {touched.phone && errors.phone && <p id="phone-error" className="form-error">{errors.phone}</p>}
          </div>

          <div className="rm-field">
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password" required minLength={8}
              placeholder="Minst 8 tecken, 1 versal, 1 gemen, 1 siffra, 1 special"
              value={values.password} onChange={handleChange} onBlur={handleBlur}
              autoComplete="new-password"
              aria-invalid={!!errors.password} aria-describedby="password-error"
            />
            {touched.password && errors.password && <p id="password-error" className="form-error">{errors.password}</p>}
          </div>

          <div className="rm-field">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm" name="confirm" type="password" required minLength={8}
              placeholder="Bekräfta lösenord"
              value={values.confirm} onChange={handleChange} onBlur={handleBlur}
              autoComplete="new-password"
              aria-invalid={!!errors.confirm} aria-describedby="confirm-error"
            />
            {touched.confirm && errors.confirm && <p id="confirm-error" className="form-error">{errors.confirm}</p>}
          </div>

          <div className="rm-actions">
            <button type="button" className="rm-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="rm-submit" disabled={submitting || !allValid}>
              {submitting ? 'Creating…' : 'Create account'}
            </button>
          </div>

          <TermsOfUse />
        </form>
      </div>
    </div>
  );
}
