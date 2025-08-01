// src/components/Dashboard/ReservationCard.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

interface Props {
  reservation: Reservation;
  onCancel: (reservationId: string, customer: Customer) => void;
  showStaffInfo?: boolean;
  staffName?: string;
  isLoading?: boolean;
}

export default function ReservationCard({ 
  reservation, 
  onCancel, 
  showStaffInfo = false, 
  staffName, 
  isLoading = false 
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      // Ajustar a timezone Uruguay (UTC-3)
      const uruguayDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));
      return format(uruguayDate, 'HH:mm');
    } catch {
      return dateStr;
    }
  };

  const getDuration = () => {
    try {
      const start = new Date(reservation.start);
      const end = new Date(reservation.end);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.round(diffMs / (1000 * 60));
      return `${diffMins} min`;
    } catch {
      return '40 min';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="font-semibold text-gray-900">{reservation.customer.name}</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {formatTime(reservation.start)} - {formatTime(reservation.end)}
              </span>
            </div>
            
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{getDuration()}</span>
              </span>
              
              {showStaffInfo && staffName && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{staffName}</span>
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Ver detalles"
            >
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => onCancel(reservation._id, reservation.customer)}
              disabled={isLoading}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Cancelar turno"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</p>
                <a 
                  href={`tel:${reservation.customer.phone}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {reservation.customer.phone}
                </a>
              </div>
              
              {reservation.customer.email && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                  <a 
                    href={`mailto:${reservation.customer.email}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {reservation.customer.email}
                  </a>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">ID de Reserva</p>
              <p className="text-xs text-gray-600 font-mono">{reservation._id}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}