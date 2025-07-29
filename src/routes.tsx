// src/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
//import LoginPage from './pages/LoginPage';
//import DashboardPage from './pages/admin/DashboardPage';
// (luego vendrán CalendarPage, ReservationsPage, etc.)

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<BookingPage />} />

      {/* Admin *
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
*/}
      {/* Cualquier otra ruta redirige a "/" */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
