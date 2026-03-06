import React, { useEffect, useState, useMemo } from "react";
import http from "../api/http";
import { useToast } from "../context/ToastContext";
import Breadcrumb from "../components/Breadcrumb";

const emptyForm = { title: "", description: "", video_url: "" };

export default function AdminWarmupMoves() {
  const toast = useToast();
  const [moves, setMoves] = useState([]);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filteredMoves = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return moves;
    return moves.filter((m) => (m.title || "").toLowerCase().includes(q) || (m.description || "").toLowerCase().includes(q));
  }, [moves, search]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await http.get("/warmup-moves");
      setMoves(res.data);
    } catch (e2) {
      setErr(e2?.response?.data?.detail || "Yüklenemedi.");
      toast.error("Hareketler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditingId(m.id);
    setForm({ title: m.title, description: m.description || "", video_url: m.video_url || "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    setSaveLoading(true);
    try {
      if (editingId) {
        const body = {};
        if (form.title) body.title = form.title;
        if (form.description !== undefined) body.description = form.description || null;
        if (form.video_url !== undefined) body.video_url = form.video_url || null;
        await http.put(`/warmup-moves/${editingId}`, body);
        toast.success("Hareket güncellendi.");
      } else {
        await http.post("/warmup-moves", {
          title: form.title,
          description: form.description || null,
          video_url: form.video_url || null,
        });
        toast.success("Hareket eklendi.");
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
    if (!window.confirm("Bu hareketi silmek istediğinize emin misiniz?")) return;
    setErr("");
    setDeletingId(id);
    try {
      await http.delete(`/warmup-moves/${id}`);
      toast.success("Hareket silindi.");
      await load();
    } catch (e2) {
      toast.error(e2?.response?.data?.detail || "Silme başarısız.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Admin", to: "/admin/warmup-moves" }, { label: "Isınma Hareketleri" }]} />
        <div className="page-loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Admin", to: "/admin/warmup-moves" }, { label: "Isınma Hareketleri" }]} />
      <div className="page-header">
        <h3 className="fw-bold m-0">Admin — Isınma Hareketleri</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark btn-sm" onClick={load}><i className="bi bi-arrow-clockwise me-1" />Yenile</button>
          <button className="btn btn-dark btn-sm" onClick={openCreate}><i className="bi bi-plus-lg me-1" />Hareket ekle</button>
        </div>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Başlık veya açıklama ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {filteredMoves.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-fire" />
          <h4>{search ? "Sonuç bulunamadı" : "Henüz hareket yok"}</h4>
          <p>{search ? "Farklı bir arama deneyin." : "İlk ısınma hareketini ekleyerek başlayın."}</p>
          {!search && <button className="btn btn-dark" onClick={openCreate}><i className="bi bi-plus-lg me-1" />Hareket ekle</button>}
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-striped m-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Başlık</th>
                  <th>Açıklama</th>
                  <th>Video URL</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredMoves.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.title}</td>
                    <td className="text-muted small">{m.description || "—"}</td>
                    <td className="small">
                      {m.video_url ? <a href={m.video_url} target="_blank" rel="noopener noreferrer">Link</a> : "—"}
                    </td>
                    <td className="text-end">
                      <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => openEdit(m)}>Düzenle</button>
                      <button className={`btn btn-outline-danger btn-sm ${deletingId === m.id ? "btn-loading" : ""}`} onClick={() => remove(m.id)} disabled={deletingId !== null}>
                        {deletingId === m.id && <span className="btn-spinner" />}
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

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingId ? "Hareket düzenle" : "Hareket ekle"}</h5>
                <button type="button" className="btn-close" onClick={closeModal} aria-label="Kapat" />
              </div>
              <form onSubmit={save}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Başlık *</label>
                    <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Açıklama</label>
                    <input className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Video URL</label>
                    <input className="form-control" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://..." />
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
