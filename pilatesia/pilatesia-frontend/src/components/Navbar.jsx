import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white pilatesia-nav">
      <div className="container">
        <Link className="navbar-brand fw-bold pilatesia-brand" to="/">
          Pilatesia
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {token ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/lessons">Dersler</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-reservations">Rezervasyonlarım</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/membership">Üyelik</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">Profil</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/warmup-moves">Isınma Hareketleri</NavLink>
                </li>
                {user?.role === "admin" && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin/lessons">Admin Dersler</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin/warmup-moves">Admin Isınma</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin/users">Admin Kullanıcılar</NavLink>
                    </li>
                  </>
                )}
              </>
            ) : null}
          </ul>

          <div className="d-flex gap-2 align-items-center">
            {token ? (
              <>
                <span className="text-muted small">
                  {user?.full_name} ({user?.role})
                </span>
                <button className="btn btn-outline-dark btn-sm" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-dark btn-sm" to="/login">Login</Link>
                <Link className="btn btn-dark btn-sm" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
