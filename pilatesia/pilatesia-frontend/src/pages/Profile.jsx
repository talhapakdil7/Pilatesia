import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import http from "../api/http";
import { useToast } from "../context/ToastContext";
import Breadcrumb from "../components/Breadcrumb";

export default function Profile() {
  const { user, refresh } = useAuth();
  const toast = useToast();
  const [full_name, setFullName] = useState(user?.full_name ?? "");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) setFullName(user.full_name);
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const body = {};
    if (full_name !== (user?.full_name ?? "")) body.full_name = full_name;
    if (password.trim()) body.password = password;
    if (Object.keys(body).length === 0) {
      setErr("Değişiklik yapmadınız.");
      return;
    }
    setLoading(true);
    try {
      await http.put("/profile", body);
      toast.success("Profil güncellendi.");
      setPassword("");
      await refresh();
    } catch (e2) {
      const msg = e2?.response?.data?.detail || "Güncelleme başarısız.";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="page-loading"><div className="spinner" /></div>;

  return (
    <div className="container py-4" style={{ maxWidth: 560 }}>
      <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Profil" }]} />
      <div className="page-header"><h3 className="fw-bold m-0">Profil</h3></div>

      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="text-muted small mb-2">Görüntüleme</h5>
          <div className="mb-2"><b>Ad soyad:</b> {user.full_name}</div>
          <div className="mb-2"><b>E-posta:</b> {user.email}</div>
          <div className="mb-0"><b>Rol:</b> {user.role}</div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h5 className="text-muted small mb-3">Profil güncelle</h5>
          {err && <div className="alert alert-danger">{err}</div>}
          <form onSubmit={onSubmit} className="d-grid gap-3">
            <div>
              <label className="form-label">Ad soyad</label>
              <input className="form-control" value={full_name} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Yeni şifre (boş bırakırsan değişmez)</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className={`btn btn-dark ${loading ? "btn-loading" : ""}`} disabled={loading}>
              {loading && <span className="btn-spinner" />}
              Güncelle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
