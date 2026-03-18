import React, { useEffect, useState } from "react";
import http from "../api/http";
import Breadcrumb from "../components/Breadcrumb";

export default function WarmupMoves() {
  const [moves, setMoves] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await http.get("/warmup-moves");
        setMoves(res.data);
      } catch (e2) {
        setErr(e2?.response?.data?.detail || "Yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Isınma Hareketleri" }]} />
        <div className="page-loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Isınma Hareketleri" }]} />
      <div className="page-header"><h3 className="fw-bold m-0">Isınma Hareketleri</h3></div>
      {err && <div className="alert alert-danger">{err}</div>}

      {moves.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-fire" />
          <h4>Henüz ısınma hareketi yok</h4>
          <p>Yakında hareketler eklenecek.</p>
        </div>
      ) : (
        <div className="row g-3">
          {moves.map((m) => (
            <div className="col-md-6 col-lg-4" key={m.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold">{m.title}</h5>
                  <p className="text-muted small mb-2">{m.description}</p>
                  {m.video_url && (
                    <a href={m.video_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm">
                      <i className="bi bi-play-circle me-1" />Video
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
