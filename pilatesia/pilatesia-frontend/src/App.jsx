import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import RequireAuth from "./auth/RequireAuth";
import RequireAdmin from "./auth/RequireAdmin";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Lessons from "./pages/Lessons";
import LessonDetail from "./pages/LessonDetail";
import MyReservations from "./pages/MyReservations";
import Membership from "./pages/Membership";
import WarmupMoves from "./pages/WarmupMoves";
import AdminUsers from "./pages/AdminUsers";
import AdminLessons from "./pages/AdminLessons";
import AdminWarmupMoves from "./pages/AdminWarmupMoves";
import HealthTools from "./pages/HealthTools";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/lessons"
              element={
                <RequireAuth>
                  <Lessons />
                </RequireAuth>
              }
            />
            <Route
              path="/lessons/:id"
              element={
                <RequireAuth>
                  <LessonDetail />
                </RequireAuth>
              }
            />
            <Route
              path="/my-reservations"
              element={
                <RequireAuth>
                  <MyReservations />
                </RequireAuth>
              }
            />
            <Route
              path="/membership"
              element={
                <RequireAuth>
                  <Membership />
                </RequireAuth>
              }
            />
            <Route path="/warmup-moves" element={<WarmupMoves />} />
            <Route path="/tools" element={<RequireAuth><HealthTools /></RequireAuth>} />
            <Route path="/bmi" element={<Navigate to="/tools" replace />} />

            <Route
              path="/admin/users"
              element={
                <RequireAdmin>
                  <AdminUsers />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/lessons"
              element={
                <RequireAdmin>
                  <AdminLessons />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/warmup-moves"
              element={
                <RequireAdmin>
                  <AdminWarmupMoves />
                </RequireAdmin>
              }
            />

            <Route path="*" element={<div className="container py-5">404</div>} />
          </Route>
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
