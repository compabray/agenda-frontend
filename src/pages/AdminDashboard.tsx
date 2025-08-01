// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { api } from '../utils/api';
import { BUSINESS_ID } from '../constants';
import DateSelector from '../components/Dashboard/DateSelector';
import StaffFilter from '../components/Dashboard/StaffFilter';
import ReservationsList from '../components/Dashboard/ReservationsList';
import StatsCard from '../components/Dashboard/StatsCard.tsx';
import NotificationSystem, { useNotifications } from '../components/NotificationSystem';

interface Customer {
  name: string;
  phone: string;
  email?: string;
}

interface Reservation {
  _id: string;
  customer: Customer;
  start: string;
  end: string;
  staffId?: string;
}

interface Staff {
  _id: string;
  name: string;
  active: boolean;
}

interface User {
  sub: string;
  businessId: string;
  role: 'admin' | 'staff';
  staffId?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();
  const [user, setUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticación y obtener info del usuario
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    // Configurar header de autorización
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Decodificar token para obtener info del usuario (básico)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
      
      // Si es staff, filtrar solo por su staffId
      if (payload.role === 'staff' && payload.staffId) {
        setSelectedStaffId(payload.staffId);
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Cargar staff
  const loadStaff = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingStaff(true);
    try {
      const response = await api.get('/admin/staff', {
        params: { businessId: BUSINESS_ID }
      });
      setStaff(response.data);
    } catch (err: any) {
      console.error('Error loading staff:', err);
      showError('Error al cargar staff', 'No se pudo cargar la información del personal');
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    } finally {
      setIsLoadingStaff(false);
    }
  }, [user, navigate]);

  // Cargar reservas
  const loadReservations = useCallback(async () => {
    if (!user) return;

    setIsLoadingReservations(true);
    setError(null);
    
    try {
      const params: any = {
        businessId: BUSINESS_ID,
        date: selectedDate
      };
      
      // Si hay staff seleccionado, incluirlo en los parámetros
      if (selectedStaffId) {
        params.staffId = selectedStaffId;
      }

      const response = await api.get('/admin/reservations', { params });
      setReservations(response.data);
    } catch (err: any) {
      console.error('Error loading reservations:', err);
      setError('Error al cargar las reservas');
      showError('Error al cargar reservas', 'No se pudieron cargar las reservas del día seleccionado');
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    } finally {
      setIsLoadingReservations(false);
    }
  }, [user, selectedDate, selectedStaffId, navigate]);

  // Efectos para cargar datos
  useEffect(() => {
    if (user) {
      loadStaff();
    }
  }, [user, loadStaff]);

  useEffect(() => {
    if (user) {
      loadReservations();
    }
  }, [user, loadReservations]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login', { replace: true });
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleStaffChange = (staffId: string | null) => {
    // Si es usuario staff, no puede cambiar el filtro
    if (user?.role === 'staff') return;
    setSelectedStaffId(staffId);
  };

  const handleReservationCancelled = () => {
    // Recargar reservas después de cancelar
    loadReservations();
    showSuccess('Reserva cancelada', 'La reserva se canceló correctamente');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard de Reservas</h1>
                <p className="text-sm text-gray-500">
                  {user.role === 'admin' ? 'Administrador' : 'Staff'} - {selectedDate}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick stats */}
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{reservations.length} reservas</span>
                </span>
                {staff.length > 0 && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{staff.filter(s => s.active).length} staff activo</span>
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Reservas hoy"
            value={reservations.length}
            subtitle={reservations.length === 1 ? "reserva programada" : "reservas programadas"}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="blue"
          />
          
          <StatsCard
            title="Staff activo"
            value={staff.filter(s => s.active).length}
            subtitle={`de ${staff.length} total`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="green"
          />

          <StatsCard
            title="Ocupación"
            value={reservations.length > 0 ? `${Math.round((reservations.length / 12) * 100)}%` : "0%"}
            subtitle="del día (estimado)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            color="purple"
          />

          <StatsCard
            title="Estado"
            value={selectedDate === format(new Date(), 'yyyy-MM-dd') ? "Hoy" : "Histórico"}
            subtitle={format(new Date(selectedDate + 'T00:00:00'), 'dd/MM/yyyy')}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Controles */}
          <div className="lg:col-span-1 space-y-6">
            {/* Date Selector */}
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />

            {/* Staff Filter - Solo mostrar si es admin o hay más de un staff */}
            {user.role === 'admin' && staff.length > 0 && (
              <StaffFilter
                staff={staff}
                selectedStaffId={selectedStaffId}
                onStaffChange={handleStaffChange}
                showAllOption={true}
              />
            )}

            {isLoadingStaff && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            )}

            {/* Quick Actions - Solo para admin */}
            {user.role === 'admin' && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Acciones rápidas</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Ver página de reservas
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    disabled
                  >
                    Configurar horarios (próximamente)
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    disabled
                  >
                    Gestionar staff (próximamente)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Reservations */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ReservationsList
                reservations={reservations}
                staff={staff}
                onReservationCancelled={handleReservationCancelled}
                isLoading={isLoadingReservations}
                showStaffInfo={user.role === 'admin'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}