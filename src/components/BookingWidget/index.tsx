import React, { useState, useCallback } from 'react';
import { api } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';
import AllSlotsCalendar from './AllSlotsCalendar';
import AvailableList from './AvailableList';
import type { AvailableResponse } from './types';
import {format} from 'date-fns'

interface Props { businessId: string; }

export default function BookingWidget({ businessId }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const fetchSlots = useCallback(() => {
    if (!selectedDate) return Promise.resolve({ data: [] } as any);
    return api
      .get<AvailableResponse>('/available', { params: { businessId, date: selectedDate } })
      .then((res) => ({ data: res.data.slots }));
  }, [businessId, selectedDate]);

  const { data: slots = [], loading } = useFetch<string[]>(fetchSlots);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setMessage(null);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setMessage(null);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;
    try {
      await api.post('/reservations', {
        businessId,
        date: selectedDate,
        time: selectedTime,
        customer: { name, phone }
      });
      setMessage('✅ ¡Turno reservado con éxito!');
      setSelectedTime(null);
      setName('');
      setPhone('');
      fetchSlots();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setMessage('⚠️ Ese turno se acaba de ocupar. Elegí otro.');
        fetchSlots();
      } else {
        setMessage('❌ Error al reservar. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="space-y-6">
   

      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendario */}
        <div className="md:w-1/2 bg-white rounded-md p-2 shadow-inner">
          <AllSlotsCalendar onSelectDate={handleSelectDate} />
        </div>

        {/* Slots + Form */}
        <div className="md:w-1/2 space-y-4">
          {/* Lista de slots */}
          {selectedDate && (
            <>
              <h3 className="text-lg font-medium text-gray-800">
                {selectedDate}
              </h3>
              {loading ? (
                <p className="text-gray-500">Cargando…</p>
              ) : (
                <AvailableList slots={slots ?? []} selected={selectedTime} onSelect={handleSelectTime} />
              )}
            </>
          )}

          {/* Formulario */}
          {selectedTime && (
            <div className="space-y-3">
                <p className="text-sm text-gray-700">
                    Turno del día: <strong>{format(new Date(selectedDate!), 'dd/MM/yyyy')}</strong><br/>
                    Hora: <strong>{selectedTime}</strong>
                </p>
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition"
              />
              <button
                disabled={!name || !phone}
                onClick={handleSubmit}
                className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-shadow shadow-md disabled:opacity-50"
              >
                Confirmar reserva
              </button>
            </div>
          )}

          {message && (
            <p className="mt-2 text-sm text-gray-800">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
