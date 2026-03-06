import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import { useToast } from "../context/ToastContext";
import Breadcrumb from "../components/Breadcrumb";

export default function Lessons() {
  const toast = useToast();
  const [lessons, setLessons] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [reservingId, setReservingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await http.get("/lessons");
      setLessons(res.data);
    } catch (e2) {
      setErr(e2?.response?.data?.detail || "Dersler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const reserve = async (lesson_id) => {
    setErr("");
    setReservingId(lesson_id);
    try {
      await http.post("/reservations", { lesson_id });
      toast.success("Rezervasyon oluşturuldu.");
      await load();
    } catch (e2) {
      const msg = e2?.response?.data?.detail || "Rezervasyon başarısız.";
      setErr(msg);
      toast.error(msg);
    } finally {
      setReservingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Dersler" }]} />
        <div className="page-loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Dersler" }]} />
      <div className="page-header">
        <h3 className="fw-bold m-0">Dersler</h3>
        <button className="btn btn-outline-dark btn-sm" onClick={load}><i className="bi bi-arrow-clockwise me-1" />Yenile</button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      {lessons.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-journal-bookmark" />
          <h4>Henüz ders yok</h4>
          <p>Yakında dersler eklenecek. Yenile butonunu deneyebilirsiniz.</p>
          <button className="btn btn-dark" onClick={load}><i className="bi bi-arrow-clockwise me-1" />Yenile</button>
        </div>
      ) : (
        <div className="row g-3">
          {lessons.map((l) => (
            <div className="col-md-6 col-lg-4" key={l.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold">
                      <Link to={`/lessons/${l.id}`} className="text-dark text-decoration-none">{l.title}</Link>
                    </h5>
                    <span className="badge text-bg-light">#{l.id}</span>
                  </div>
                  <div className="text-muted small mb-2">{l.description}</div>
                  <div className="small">
                    <div><b>Eğitmen:</b> {l.instructor_name}</div>
                    <div><b>Başlangıç:</b> {l.start_time}</div>
                    <div><b>Süre:</b> {l.duration} dk</div>
                    <div><b>Kapasite:</b> {l.capacity}</div>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 p-3">
                  <button
                    className={`btn btn-dark w-100 ${reservingId === l.id ? "btn-loading" : ""}`}
                    onClick={() => reserve(l.id)}
                    disabled={reservingId !== null}
                  >
                    {reservingId === l.id && <span className="btn-spinner" />}
                    Rezervasyon yap
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
