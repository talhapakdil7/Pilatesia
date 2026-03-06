import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import { useToast } from "../context/ToastContext";
import Breadcrumb from "../components/Breadcrumb";

export default function MyReservations() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await http.get("/my-reservations");
      setRows(res.data);
    } catch (e2) {
      setErr(e2?.response?.data?.detail || "Rezervasyonlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    setErr("");
    setCancellingId(id);
    try {
      await http.delete(`/reservations/${id}`);
      toast.success("Rezervasyon iptal edildi.");
      await load();
    } catch (e2) {
      const msg = e2?.response?.data?.detail || "İptal başarısız.";
      setErr(msg);
      toast.error(msg);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Rezervasyonlarım" }]} />
        <div className="page-loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Rezervasyonlarım" }]} />
      <div className="page-header">
        <h3 className="fw-bold m-0">Rezervasyonlarım</h3>
        <button className="btn btn-outline-dark btn-sm" onClick={load}><i className="bi bi-arrow-clockwise me-1" />Yenile</button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      {rows.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-calendar-check" />
          <h4>Aktif rezervasyonunuz yok</h4>
          <p>Derslere rezervasyon yaparak burada görebilirsiniz.</p>
          <Link to="/lessons" className="btn btn-dark"><i className="bi bi-journal-bookmark me-1" />Derslere git</Link>
        </div>
      ) : (
        <>
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <table className="table table-striped m-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Durum</th>
                    <th>Ders</th>
                    <th>Başlangıç</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.reservation_id}>
                      <td>{r.reservation_id}</td>
                      <td>
                        <span className={`status-pill ${r.status === "active" ? "active" : "cancelled"}`}>
                          {r.status === "active" ? "Aktif" : "İptal"}
                        </span>
                      </td>
                      <td>{r.lesson?.title} — {r.lesson?.instructor_name}</td>
                      <td>{r.lesson?.start_time}</td>
                      <td className="text-end">
                        <button
                          className={`btn btn-outline-danger btn-sm ${cancellingId === r.reservation_id ? "btn-loading" : ""}`}
                          onClick={() => cancel(r.reservation_id)}
                          disabled={r.status !== "active" || cancellingId !== null}
                        >
                          {cancellingId === r.reservation_id && <span className="btn-spinner" />}
                          İptal
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-muted small mt-2">
            İptal ettiğiniz rezervasyonlar listede "İptal" olarak görünür; kredi iade edilir.
          </div>
        </>
      )}
    </div>
  );
}
