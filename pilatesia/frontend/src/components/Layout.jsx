import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  if (!token) {
    return <Outlet />;
  }

  const navItem = (to, icon, label) => (
    <li className="nav-item">
      <NavLink className="sidebar-link" to={to}>
        <i className={`bi bi-${icon}`} />
        <span>{label}</span>
      </NavLink>
    </li>
  );

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link className="sidebar-brand" to="/">
          <i className="bi bi-heart-pulse" />
          <span>Pilatesia</span>
        </Link>
        <nav className="sidebar-nav">
          <ul className="nav flex-column">
            {navItem("dashboard", "house", "Ana Sayfa")}
            {navItem("lessons", "journal-bookmark", "Dersler")}
            {navItem("my-reservations", "calendar-check", "Rezervasyonlarım")}
            {navItem("membership", "credit-card", "Üyelik")}
            {navItem("profile", "person", "Profil")}
            {navItem("warmup-moves", "fire", "Isınma Hareketleri")}
            {navItem("tools", "calculator", "Sağlık Araçları")}
            {user?.role === "admin" && (
              <>
                <li className="nav-item sidebar-divider">
                  <span className="sidebar-label">Admin</span>
                </li>
                {navItem("admin/lessons", "journal-text", "Admin Dersler")}
                {navItem("admin/warmup-moves", "fire", "Admin Isınma")}
                {navItem("admin/users", "people", "Admin Kullanıcılar")}
              </>
            )}
          </ul>
        </nav>
      </aside>
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">Pilatesia</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-user">
              <span className="topbar-avatar">
                {user?.full_name?.charAt(0)?.toUpperCase() || "?"}
              </span>
              <span className="topbar-name">{user?.full_name}</span>
              <span className="topbar-role">{user?.role}</span>
            </span>
            <button type="button" className="btn btn-topbar-logout" onClick={onLogout}>
              <i className="bi bi-box-arrow-right" />
              Çıkış
            </button>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
