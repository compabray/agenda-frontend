// src/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Página principal de reservas */}
      <Route path="/" element={<BookingPage />} />
      
      {/* Login de administradores */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Panel de administración - Protegido */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Dashboard específico para admin */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Cualquier otra ruta redirige a "/" */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}