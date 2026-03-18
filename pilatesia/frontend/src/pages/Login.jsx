import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Giriş başarılı.");
      nav("/dashboard");
    } catch (e2) {
      const detail = e2?.response?.data?.detail;
      const msg = detail ? (typeof detail === "string" ? detail : JSON.stringify(detail)) : (e2?.message === "Network Error" || !e2?.response ? "Sunucuya ulaşılamadı." : "Giriş başarısız.");
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-bg" aria-hidden="true">
        <span className="auth-bg-blob auth-bg-blob-1" />
        <span className="auth-bg-blob auth-bg-blob-2" />
        <span className="auth-bg-blob auth-bg-blob-3" />
      </div>
      <div className="auth-page container py-5">
        <div className="auth-brand">
          <div className="auth-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" stroke="url(#authGrad)" strokeWidth="2.5" fill="none" />
              <path d="M18 24c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="url(#authGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />
              <defs>
                <linearGradient id="authGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--pilatesia-primary)" />
                  <stop offset="1" stopColor="var(--pilatesia-pink)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="auth-brand-name">Pilatesia</h1>
          <p className="auth-brand-tagline">Hareket, nefes, denge.</p>
        </div>
        <div className="card auth-card shadow-sm">
          <div className="card-body p-4 p-md-5">
            <h2 className="auth-form-title">Giriş</h2>
            <p className="auth-form-desc">Devam etmek için hesabınıza giriş yapın.</p>

            {err && <div className="alert alert-danger" role="alert">{err}</div>}

            <form onSubmit={onSubmit} className="auth-form">
              <div className="auth-field">
                <label className="form-label" htmlFor="login-email">E-posta</label>
                <input id="login-email" type="email" className="form-control form-control-lg" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="auth-field">
                <label className="form-label" htmlFor="login-password">Şifre</label>
                <input id="login-password" type="password" className="form-control form-control-lg" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              </div>
              <button type="submit" className={`btn btn-dark btn-lg auth-submit ${loading ? "btn-loading" : ""}`} disabled={loading}>
                {loading && <span className="btn-spinner" />}
                Giriş yap
              </button>
            </form>

            <div className="auth-footer">
              <span className="auth-footer-text">Hesabınız yok mu?</span>
              <Link to="/register" className="auth-link-btn">Kayıt olun</Link>
              <span className="ms-2">·</span>
              <Link to="/register-studio" className="auth-link-btn ms-2">Stüdyo aç</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
