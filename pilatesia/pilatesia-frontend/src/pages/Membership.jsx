import React, { useEffect, useState } from "react";
import http from "../api/http";
import Breadcrumb from "../components/Breadcrumb";

export default function Membership() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await http.get("/membership");
      setData(res.data);
    } catch (e2) {
      setErr(e2?.response?.data?.detail || "Üyelik bilgisi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Üyelik" }]} />
        <div className="page-loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Üyelik" }]} />
      <div className="page-header">
        <h3 className="fw-bold m-0">Üyelik</h3>
        <button className="btn btn-outline-dark btn-sm" onClick={load}><i className="bi bi-arrow-clockwise me-1" />Yenile</button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      {data && (
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between">
              <div>
                <div className="text-muted small">Durum</div>
                <div className="fw-bold fs-5 text-capitalize">{data.status}</div>
              </div>
              <div className="text-end">
                <div className="text-muted small">Kalan ders hakkı</div>
                <div className="fw-bold fs-2">{data.remaining_cred ?? 0}</div>
              </div>
            </div>
            <hr />
            <div className="text-muted small">
              Kredi ekleme veya üyelik durumu için yöneticinizle iletişime geçebilirsiniz.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
