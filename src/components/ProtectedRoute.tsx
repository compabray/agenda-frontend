// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../utils/api';

interface User {
  sub: string;
  businessId: string;
  role: 'admin' | 'staff';
  staffId?: string;
}

interface Props {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff';
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Decodificar el token JWT para obtener la información del usuario
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Verificar si el token ha expirado
        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
          return;
        }

        // Configurar header de autorización
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(payload);
        
        // Verificar si el usuario tiene el rol requerido
        if (requiredRole && payload.role !== requiredRole) {
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  // Mostrar loading mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si llegó hasta aquí, está autenticado y autorizado
  return <>{children}</>;
}