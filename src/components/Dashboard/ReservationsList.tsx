// src/components/Dashboard/ReservationsList.tsx
import React, { useState } from 'react';
import ReservationCard from './ReservationCard';
import CancellationModal from './CancellationModal';
import { api } from '../../utils/api';

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

interface Props {
  reservations: Reservation[];
  staff: Staff[];
  onReservationCancelled: () => void;
  isLoading?: boolean;
  showStaffInfo?: boolean;
}

export default function ReservationsList({ 
  reservations, 
  staff, 
  onReservationCancelled, 
  isLoading = false,
  showStaffInfo = true 
}: Props) {
  const [selectedReservation, setSelectedReservation] = useState<{
    id: string;
    customer: Customer;
  } | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const getStaffName = (staffId: string | undefined) => {
    if (!staffId) return 'Sin asignar';
    const staffMember = staff.find(s => s._id === staffId);
    return staffMember?.name || 'Desconocido';
  };

  const handleCancelClick = (reservationId: string, customer: Customer) => {
    setSelectedReservation({ id: reservationId, customer });
  };

  const handleConfirmCancellation = async () => {
    if (!selectedReservation) return;

    setIsCancelling(true);
    try {
      await api.delete(`/reservations/${selectedReservation.id}`);
      setSelectedReservation(null);
      onReservationCancelled();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCloseCancellationModal = () => {
    setSelectedReservation(null);
  };

  // Agrupar reservas por horario para mejor visualización
  const sortedReservations = [...reservations].sort((a, b) => 
    new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="mt-2 h-3 bg-gray-300 rounded w-48"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sortedReservations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin reservas</h3>
        <p className="text-gray-500 text-sm">No hay turnos programados para este día.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Reservas del día ({sortedReservations.length})
          </h3>
          
          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{sortedReservations.length} confirmadas</span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {sortedReservations.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              onCancel={handleCancelClick}
              showStaffInfo={showStaffInfo}
              staffName={getStaffName(reservation.staffId)}
              isLoading={isCancelling}
            />
          ))}
        </div>
      </div>

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={selectedReservation !== null}
        customer={selectedReservation?.customer || { name: '', phone: '' }}
        onConfirm={handleConfirmCancellation}
        onCancel={handleCloseCancellationModal}
        isLoading={isCancelling}
      />
    </>
  );
}