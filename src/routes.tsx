// src/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Página principal de reservas */}
      <Route path="/" element={<BookingPage />} />
      
      {/* Login de administradores */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Panel de administración */}
      <Route path="/admin" element={<AdminPage />} />

      {/* Cualquier otra ruta redirige a "/" */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}