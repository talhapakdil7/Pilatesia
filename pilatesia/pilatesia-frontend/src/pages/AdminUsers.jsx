import React, { useEffect, useState, useMemo } from "react";
import http from "../api/http";
import { useToast } from "../context/ToastContext";
import Breadcrumb from "../components/Breadcrumb";

const emptyUser = { full_name: "", email: "", password: "", role: "user" };

export default function AdminUsers() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyUser);
  const [saveLoading, setSaveLoading] = useState(false);
  const [creditModalUser, setCreditModalUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState(10);
  const [creditLoading, setCreditLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      (u.full_name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
    );
  }, [users, search]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await http.get("/admin/users");
      setUsers(res.data);
    } catch (e2) {
      setErr(e2?.response?.data?.detail || "Yüklenemedi.");
      toast.error("Kullanıcılar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyUser);
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setForm({ full_name: u.full_name, email: u.email, password: "", role: u.role });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm(emptyUser);
  };

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    setSaveLoading(true);
    try {
      if (editingUser) {
        const body = {};
        if (form.full_name !== editingUser.full_name) body.full_name = form.full_name;
        if (form.email !== editingUser.email) body.email = form.email;
        if (form.password.trim()) body.password = form.password;
        if (form.role !== editingUser.role) body.role = form.role;
        if (Object.keys(body).length === 0) {
          setErr("Değişiklik yapmadınız.");
          return;
        }
        await http.patch(`/admin/users/${editingUser.id}`, body);
        toast.success("Kullanıcı güncellendi.");
      } else {
        if (!form.password.trim()) {
          setErr("Şifre gerekli.");
          return;
        }
        await http.post("/admin/users", {
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        toast.success("Kullanıcı eklendi.");
      }
      closeModal();
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.detail || "İşlem başarısız.");
      toast.error(e2?.response?.data?.detail || "İşlem başarısız.");
    } finally {
      setSaveLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    setErr("");
    setDeletingId(id);
    try {
      await http.delete(`/admin/users/${id}`);
      toast.success("Kullanıcı silindi.");
      await load();
    } catch (e2) {
      toast.error(e2?.response?.data?.detail || "Silme başarısız.");
    } finally {
      setDeletingId(null);
    }
  };

  const openCreditModal = (u) => {
    setCreditModalUser(u);
    setCreditAmount(10);
  };
  const closeCreditModal = () => setCreditModalUser(null);

  const addCredits = async (e) => {
    e.preventDefault();
    if (!creditModalUser || creditAmount < 1) return;
    setErr("");
    setCreditLoading(true);
    try {
      await http.patch(`/admin/users/${creditModalUser.id}/credits`, { add_credits: creditAmount });
      toast.success(`${creditAmount} kredi eklendi.`);
      closeCreditModal();
      await load();
    } catch (e2) {
      toast.error(e2?.response?.data?.detail || "Kredi eklenemedi.");
    } finally {
      setCreditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Admin", to: "/admin/users" }, { label: "Kullanıcılar" }]} />
        <div className="page-loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Admin", to: "/admin/users" }, { label: "Kullanıcılar" }]} />
      <div className="page-header">
        <h3 className="fw-bold m-0">Admin — Kullanıcılar</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark btn-sm" onClick={load}><i className="bi bi-arrow-clockwise me-1" />Yenile</button>
          <button className="btn btn-dark btn-sm" onClick={openCreate}><i className="bi bi-person-plus me-1" />Kullanıcı ekle</button>
        </div>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Ad veya e-posta ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-people" />
          <h4>{search ? "Sonuç bulunamadı" : "Henüz kullanıcı yok"}</h4>
          <p>{search ? "Farklı bir arama deneyin." : "İlk kullanıcıyı ekleyerek başlayın."}</p>
          {!search && <button className="btn btn-dark" onClick={openCreate}><i className="bi bi-person-plus me-1" />Kullanıcı ekle</button>}
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-striped m-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ad soyad</th>
                  <th>E-posta</th>
                  <th>Rol</th>
                  <th>Kredi</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.remaining_cred ?? 0}</td>
                    <td className="text-end">
                      <button className="btn btn-outline-success btn-sm me-1" onClick={() => openCreditModal(u)}>Kredi ekle</button>
                      <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => openEdit(u)}>Düzenle</button>
                      <button className={`btn btn-outline-danger btn-sm ${deletingId === u.id ? "btn-loading" : ""}`} onClick={() => remove(u.id)} disabled={deletingId !== null}>
                        {deletingId === u.id && <span className="btn-spinner" />}
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {creditModalUser && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Kredi ekle — {creditModalUser.full_name}</h5>
                <button type="button" className="btn-close" onClick={closeCreditModal} aria-label="Kapat" />
              </div>
              <form onSubmit={addCredits}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Eklenecek kredi</label>
                    <input type="number" className="form-control" min={1} value={creditAmount} onChange={(e) => setCreditAmount(Number(e.target.value) || 0)} />
                  </div>
                  <div className="small text-muted">Mevcut: {creditModalUser.remaining_cred ?? 0}</div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeCreditModal}>İptal</button>
                  <button type="submit" className={`btn btn-success ${creditLoading ? "btn-loading" : ""}`} disabled={creditLoading}>
                    {creditLoading && <span className="btn-spinner" />}
                    Ekle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingUser ? "Kullanıcı düzenle" : "Kullanıcı ekle"}</h5>
                <button type="button" className="btn-close" onClick={closeModal} aria-label="Kapat" />
              </div>
              <form onSubmit={save}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Ad soyad *</label>
                    <input className="form-control" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">E-posta *</label>
                    <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">{editingUser ? "Yeni şifre (boş bırakırsan değişmez)" : "Şifre *"}</label>
                    <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingUser ? "••••••••" : ""} required={!editingUser} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Rol</label>
                    <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                      <option value="user">Kullanıcı</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>İptal</button>
                  <button type="submit" className={`btn btn-dark ${saveLoading ? "btn-loading" : ""}`} disabled={saveLoading}>
                    {saveLoading && <span className="btn-spinner" />}
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
