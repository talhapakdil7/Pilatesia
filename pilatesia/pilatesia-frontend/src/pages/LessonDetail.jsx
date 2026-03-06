import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../api/http";
import { useToast } from "../context/ToastContext";
import Breadcrumb from "../components/Breadcrumb";

export default function LessonDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [lesson, setLesson] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [reserveLoading, setReserveLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    async function load() {
      try {
        const res = await http.get(`/lessons/${id}`);
        if (!cancelled) setLesson(res.data);
      } catch (e2) {
        if (!cancelled) setErr(e2?.response?.data?.detail || "Ders bulunamadı.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const reserve = async () => {
    setErr("");
    setReserveLoading(true);
    try {
      await http.post("/reservations", { lesson_id: Number(id) });
      toast.success("Rezervasyon oluşturuldu.");
    } catch (e2) {
      const msg = e2?.response?.data?.detail || "Rezervasyon başarısız.";
      setErr(msg);
      toast.error(msg);
    } finally {
      setReserveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="page-loading"><div className="spinner" /></div>
      </div>
    );
  }

  if (err && !lesson) {
    return (
      <div className="container py-4">
        <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Dersler", to: "/lessons" }, { label: "Detay" }]} />
        <div className="alert alert-danger">{err}</div>
        <button className="btn btn-outline-dark" onClick={() => nav("/lessons")}><i className="bi bi-arrow-left me-1" />Derslere dön</button>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 640 }}>
      <Breadcrumb items={[{ label: "Ana Sayfa", to: "/dashboard" }, { label: "Dersler", to: "/lessons" }, { label: lesson?.title }]} />
      <button className="btn btn-link text-dark p-0 mb-3" onClick={() => nav("/lessons")}><i className="bi bi-arrow-left me-1" />Derslere dön</button>
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h3 className="fw-bold m-0">{lesson.title}</h3>
            <span className="badge bg-light text-dark">#{lesson.id}</span>
          </div>
          {lesson.description && <p className="text-muted">{lesson.description}</p>}
          <ul className="list-unstyled mb-0">
            <li><b>Eğitmen:</b> {lesson.instructor_name}</li>
            <li><b>Başlangıç:</b> {lesson.start_time}</li>
            <li><b>Süre:</b> {lesson.duration} dk</li>
            <li><b>Kapasite:</b> {lesson.capacity}</li>
          </ul>
          <hr />
          <button
            className={`btn btn-dark w-100 ${reserveLoading ? "btn-loading" : ""}`}
            onClick={reserve}
            disabled={reserveLoading}
          >
            {reserveLoading && <span className="btn-spinner" />}
            Rezervasyon yap
          </button>
        </div>
      </div>
    </div>
  );
}
