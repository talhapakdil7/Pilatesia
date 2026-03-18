import React, { useEffect, useState, useMemo } from "react";
import http from "../api/http";
import { useToast } from "../context/ToastContext";
import Breadcrumb from "../components/Breadcrumb";

const emptyLesson = { title: "", description: "", instructor_name: "", start_time: "", duration: 60, capacity: 10 };

function toDateTimeLocal(apiValue) {
  if (!apiValue) return "";
  const s = String(apiValue).trim().replace(" ", "T").slice(0, 16);
  return s.length >= 16 ? s : apiValue;
}
function fromDateTimeLocal(localValue) {
  if (!localValue) return "";
  return String(localValue).trim().replace("T", " ");
}
function getMinDatetimeLocal() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminLessons() {
  const toast = useToast();
  const [lessons, setLessons] = useState([]);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyLesson);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filteredLessons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lessons;
    return lessons.filter((l) =>
      (l.title || "").toLowerCase().includes(q) || (l.instructor_name || "").toLowerCase().includes(q)
    );
  }, [lessons, search]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await http.get("/admin/lessons");
      setLessons(res.data);
    } catch (e2) {
      setErr(e2?.response?.data?.detail || "Yüklenemedi.");
      toast.error("Dersler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyLesson);
    setShowModal(true);
  };

  const openEdit = (l) => {
    setEditingId(l.id);
    setForm({
      title: l.title,
      description: l.description || "",
      instructor_name: l.instructor_name,
      start_time: toDateTimeLocal(l.start_time),
      duration: l.duration,
      capacity: l.capacity,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyLesson);
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
        if (form.instructor_name) body.instructor_name = form.instructor_name;
        if (form.start_time) body.start_time = fromDateTimeLocal(form.start_time);
        if (form.duration != null) body.duration = Number(form.duration);
        if (form.capacity != null) body.capacity = Number(form.capacity);
        await http.put(`/admin/lessons/${editingId}`, body);
        toast.success("Ders güncellendi.");
      } else {
        await http.post("/admin/lessons", {
          title: form.title,
          description: form.description || null,
          instructor_name: form.instructor_name,
          start_time: fromDateTimeLocal(form.start_time),
          duration: Number(form.duration),
          capacity: Number(form.capacity),
        });
        toast.success("Ders eklendi.");
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
    if (!window.confirm("Bu dersi silmek istediğinize emin misiniz?")) return;
    setErr("");
    setDeletingId(id);
    try {
      await http.delete(`/admin/lessons/${id}`);
      toast.success("Ders silindi.");
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
        <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Admin", to: "/admin/lessons" }, { label: "Dersler" }]} />
        <div className="page-loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Admin", to: "/admin/lessons" }, { label: "Dersler" }]} />
      <div className="page-header">
        <h3 className="fw-bold m-0">Admin — Dersler</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark btn-sm" onClick={load}><i className="bi bi-arrow-clockwise me-1" />Yenile</button>
          <button className="btn btn-dark btn-sm" onClick={openCreate}><i className="bi bi-plus-lg me-1" />Ders ekle</button>
        </div>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Başlık veya eğitmen adı ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {filteredLessons.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-journal-text" />
          <h4>{search ? "Sonuç bulunamadı" : "Henüz ders yok"}</h4>
          <p>{search ? "Farklı bir arama deneyin." : "İlk dersi ekleyerek başlayın."}</p>
          {!search && <button className="btn btn-dark" onClick={openCreate}><i className="bi bi-plus-lg me-1" />Ders ekle</button>}
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-striped m-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Başlık</th>
                  <th>Eğitmen</th>
                  <th>Başlangıç</th>
                  <th>Süre</th>
                  <th>Kapasite</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredLessons.map((l) => (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>{l.title}</td>
                    <td>{l.instructor_name}</td>
                    <td>{l.start_time}</td>
                    <td>{l.duration} dk</td>
                    <td>{l.capacity}</td>
                    <td className="text-end">
                      <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => openEdit(l)}>Düzenle</button>
                      <button className={`btn btn-outline-danger btn-sm ${deletingId === l.id ? "btn-loading" : ""}`} onClick={() => remove(l.id)} disabled={deletingId !== null}>
                        {deletingId === l.id && <span className="btn-spinner" />}
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
                <h5 className="modal-title">{editingId ? "Ders düzenle" : "Ders ekle"}</h5>
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
                    <label className="form-label">Eğitmen *</label>
                    <input className="form-control" value={form.instructor_name} onChange={(e) => setForm({ ...form, instructor_name: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Başlangıç *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={form.start_time}
                      onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                      min={editingId ? undefined : getMinDatetimeLocal()}
                      required
                    />
                    {!editingId && (
                      <div className="form-text">Sadece bugün ve sonrası seçilebilir.</div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <label className="form-label">Süre (dk)</label>
                      <input type="number" className="form-control" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} min={1} />
                    </div>
                    <div className="col-6 mb-2">
                      <label className="form-label">Kapasite</label>
                      <input type="number" className="form-control" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} min={1} />
                    </div>
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
