import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import { useAuth } from "../auth/AuthContext";
import LessonCalendar from "../components/LessonCalendar";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [membership, setMembership] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [lessonsCount, setLessonsCount] = useState(0);
  const [warmupCount, setWarmupCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (isAdmin) {
          const [uRes, lRes, wRes, lessonsRes] = await Promise.all([
            http.get("/admin/users").catch(() => ({ data: [] })),
            http.get("/admin/lessons").catch(() => ({ data: [] })),
            http.get("/warmup-moves").catch(() => ({ data: [] })),
            http.get("/lessons").catch(() => ({ data: [] })),
          ]);
          if (!cancelled) {
            setUsersCount(Array.isArray(uRes.data) ? uRes.data.length : 0);
            setLessonsCount(Array.isArray(lRes.data) ? lRes.data.length : 0);
            setWarmupCount(Array.isArray(wRes.data) ? wRes.data.length : 0);
            setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : []);
          }
        } else {
          const [mRes, rRes, lessonsRes] = await Promise.all([
            http.get("/membership").catch(() => ({ data: null })),
            http.get("/my-reservations").catch(() => ({ data: [] })),
            http.get("/lessons").catch(() => ({ data: [] })),
          ]);
          if (!cancelled) {
            setMembership(mRes.data);
            setReservations(Array.isArray(rRes.data) ? rRes.data : []);
            setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : []);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isAdmin]);

  const activeCount = reservations.filter((r) => r.status === "active").length;
  const nextRes = reservations.find((r) => r.status === "active");

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="container-fluid">
        <div className="page-header">
          <h3 className="fw-bold m-0">Ana Sayfa (Admin)</h3>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="kpi-card kpi-1">
              <div className="kpi-value">{usersCount}</div>
              <div className="kpi-label">Toplam kullanıcı</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="kpi-card kpi-2">
              <div className="kpi-value">{lessonsCount}</div>
              <div className="kpi-label">Toplam ders</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="kpi-card kpi-3">
              <div className="kpi-value">{warmupCount}</div>
              <div className="kpi-label">Isınma hareketi</div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Hızlı erişim</h5>
                <div className="d-flex flex-column gap-2">
                  <Link to="/admin/users" className="btn btn-dark">
                    <i className="bi bi-people me-2" />
                    Kullanıcıları yönet
                  </Link>
                  <Link to="/admin/lessons" className="btn btn-outline-dark">
                    <i className="bi bi-journal-text me-2" />
                    Dersleri yönet
                  </Link>
                  <Link to="/admin/warmup-moves" className="btn btn-outline-dark">
                    <i className="bi bi-fire me-2" />
                    Isınma hareketleri
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Özet</h5>
                <p className="text-muted small mb-0">
                  Sistemde {usersCount} kullanıcı, {lessonsCount} ders ve {warmupCount} ısınma hareketi bulunuyor. Yukarıdaki linklerden yönetebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <LessonCalendar lessons={lessons} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="page-header">
        <h3 className="fw-bold m-0">Ana Sayfa</h3>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="kpi-card kpi-1">
            <div className="kpi-value">{membership?.remaining_cred ?? 0}</div>
            <div className="kpi-label">Kalan ders hakkı</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="kpi-card kpi-2">
            <div className="kpi-value">{activeCount}</div>
            <div className="kpi-label">Aktif rezervasyon</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="kpi-card kpi-3">
            <div className="kpi-value">{nextRes ? 1 : 0}</div>
            <div className="kpi-label">Sonraki ders</div>
            {nextRes?.lesson && (
              <div className="small mt-1 opacity-90">{nextRes.lesson.title}</div>
            )}
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Hızlı erişim</h5>
              <div className="d-flex flex-column gap-2">
                <Link to="/lessons" className="btn btn-dark">
                  <i className="bi bi-journal-bookmark me-2" />
                  Derslere git
                </Link>
                <Link to="/my-reservations" className="btn btn-outline-dark">
                  <i className="bi bi-calendar-check me-2" />
                  Rezervasyonlarım
                </Link>
                <Link to="/membership" className="btn btn-outline-dark">
                  <i className="bi bi-credit-card me-2" />
                  Üyelik bilgisi
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Özet</h5>
              <p className="text-muted small mb-0">
                {membership?.remaining_cred > 0
                  ? `${membership.remaining_cred} ders hakkınız var. Derslere katılmak için rezervasyon yapabilirsiniz.`
                  : "Kalan ders hakkınız yok. Üyelik sayfasından bilgi alabilirsiniz."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <LessonCalendar lessons={lessons} />
        </div>
      </div>
    </div>
  );
}
