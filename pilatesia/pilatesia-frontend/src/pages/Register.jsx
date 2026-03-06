import React, { useState } from "react";
import http from "../api/http";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const toast = useToast();
  const nav = useNavigate();
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await http.post("/register", { full_name, email, password });
      toast.success("Hesap oluşturuldu. Giriş yapabilirsiniz.");
      setTimeout(() => nav("/login"), 800);
    } catch (e2) {
      const msg = e2?.response?.data?.detail || "Kayıt başarısız.";
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
              <circle cx="24" cy="24" r="20" stroke="url(#authGradR)" strokeWidth="2.5" fill="none" />
              <path d="M18 24c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="url(#authGradR)" strokeWidth="2" strokeLinecap="round" fill="none" />
              <defs>
                <linearGradient id="authGradR" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
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
            <h2 className="auth-form-title">Kayıt ol</h2>
            <p className="auth-form-desc">Yeni hesap oluşturup derslere katılmaya başlayın.</p>

            {err && <div className="alert alert-danger" role="alert">{err}</div>}

            <form onSubmit={onSubmit} className="auth-form">
              <div className="auth-field">
                <label className="form-label" htmlFor="reg-name">Ad soyad</label>
                <input id="reg-name" className="form-control form-control-lg" placeholder="Adınız soyadınız" value={full_name} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" />
              </div>
              <div className="auth-field">
                <label className="form-label" htmlFor="reg-email">E-posta</label>
                <input id="reg-email" type="email" className="form-control form-control-lg" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="auth-field">
                <label className="form-label" htmlFor="reg-password">Şifre</label>
                <input id="reg-password" type="password" className="form-control form-control-lg" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
              </div>

              <button type="submit" className={`btn btn-dark btn-lg auth-submit ${loading ? "btn-loading" : ""}`} disabled={loading}>
                {loading && <span className="btn-spinner" />}
                Hesap oluştur
              </button>
            </form>

            <div className="auth-footer">
              <span className="auth-footer-text">Zaten hesabınız var mı?</span>
              <Link to="/login" className="auth-link-btn">Giriş yapın</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
