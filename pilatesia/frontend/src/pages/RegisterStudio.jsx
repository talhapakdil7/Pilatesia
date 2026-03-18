import React, { useState } from "react";
import http from "../api/http";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function RegisterStudio() {
  const toast = useToast();
  const nav = useNavigate();
  const [studio_name, setStudioName] = useState("");
  const [studio_code, setStudioCode] = useState("");
  const [admin_name, setAdminName] = useState("");
  const [admin_email, setAdminEmail] = useState("");
  const [admin_password, setAdminPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await http.post("/register-studio", {
        studio_name,
        studio_code: studio_code.trim().toLowerCase(),
        admin_name,
        admin_email,
        admin_password,
      });
      toast.success("Stüdyo oluşturuldu. Giriş yapabilirsiniz.");
      setTimeout(() => nav("/login"), 800);
    } catch (e2) {
      const msg = e2?.response?.data?.detail || "Stüdyo oluşturulamadı.";
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
          <p className="auth-brand-tagline">Yeni stüdyo aç</p>
        </div>
        <div className="card auth-card shadow-sm">
          <div className="card-body p-4 p-md-5">
            <h2 className="auth-form-title">Stüdyo Kaydı</h2>
            <p className="auth-form-desc">Yeni bir pilates stüdyosu oluşturun ve admin hesabınızı alın.</p>

            {err && <div className="alert alert-danger" role="alert">{err}</div>}

            <form onSubmit={onSubmit} className="auth-form">
              <div className="auth-field">
                <label className="form-label" htmlFor="studio-name">Stüdyo adı</label>
                <input id="studio-name" className="form-control form-control-lg" placeholder="Örn: İstanbul Pilates" value={studio_name} onChange={(e) => setStudioName(e.target.value)} required />
              </div>
              <div className="auth-field">
                <label className="form-label" htmlFor="studio-code">Stüdyo kodu</label>
                <input id="studio-code" className="form-control form-control-lg" placeholder="örn: istanbul-pilates" value={studio_code} onChange={(e) => setStudioCode(e.target.value)} required autoComplete="off" />
                <div className="form-text">Benzersiz kod. Üyeler bu kodu kullanarak kayıt olur (küçük harf, tire ile).</div>
              </div>
              <hr className="my-3" />
              <h6 className="fw-bold mb-2">Admin hesabı</h6>
              <div className="auth-field">
                <label className="form-label" htmlFor="admin-name">Ad soyad</label>
                <input id="admin-name" className="form-control form-control-lg" placeholder="Admin adınız" value={admin_name} onChange={(e) => setAdminName(e.target.value)} required />
              </div>
              <div className="auth-field">
                <label className="form-label" htmlFor="admin-email">E-posta</label>
                <input id="admin-email" type="email" className="form-control form-control-lg" placeholder="admin@stüdyo.com" value={admin_email} onChange={(e) => setAdminEmail(e.target.value)} required />
              </div>
              <div className="auth-field">
                <label className="form-label" htmlFor="admin-password">Şifre</label>
                <input id="admin-password" type="password" className="form-control form-control-lg" placeholder="••••••••" value={admin_password} onChange={(e) => setAdminPassword(e.target.value)} required />
              </div>

              <button type="submit" className={`btn btn-dark btn-lg auth-submit ${loading ? "btn-loading" : ""}`} disabled={loading}>
                {loading && <span className="btn-spinner" />}
                Stüdyo oluştur
              </button>
            </form>

            <div className="auth-footer">
              <span className="auth-footer-text">Zaten stüdyonuz var mı?</span>
              <Link to="/register" className="auth-link-btn">Üye olarak kayıt olun</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
