import React, { useState, useCallback } from 'react';
import { api } from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';
import AllSlotsCalendar from './AllSlotsCalendar';
import AvailableList from './AvailableList';
import type { AvailableResponse } from './types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props { 
  businessId: string; 
}

export default function BookingWidget({ businessId }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setStep(2); // Automáticamente ir al paso 2
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setMessage(null);
    setStep(3); // Automáticamente ir al paso 3
  };

  const handleGoBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !name.trim() || !phone.trim()) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/reservations', {
        businessId,
        date: selectedDate,
        time: selectedTime,
        customer: { name: name.trim(), phone: phone.trim() }
      });
      setMessage('success');
      setSelectedTime(null);
      setName('');
      setPhone('');
      setStep(1);
      setSelectedDate(null);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setMessage('conflict');
        setStep(2); // Volver al paso 2 para seleccionar otro horario
      } else {
        setMessage('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return format(date, "EEEE d 'de' MMMM", { locale: es });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="hidden sm:inline text-sm font-medium">Elegí la fecha</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="hidden sm:inline text-sm font-medium">Elegí el horario</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span className="hidden sm:inline text-sm font-medium">Confirmá</span>
        </div>
      </div>

      {/* Back Button - Solo mostrar en steps 2 y 3 */}
      {step > 1 && (
        <div className="flex justify-start">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Volver atrás</span>
          </button>
        </div>
      )}

      {/* Step 1: Calendar */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Seleccioná tu fecha</h2>
              <p className="text-sm text-gray-600 mt-1">Elegí el día que te convenga</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <AllSlotsCalendar onSelectDate={handleSelectDate} />
          </div>
        </div>
      )}

      {/* Step 2: Time Selection */}
      {step === 2 && selectedDate && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900">Elegí tu horario</h3>
              <p className="text-sm text-gray-600 capitalize mt-1">{formatDisplayDate(selectedDate)}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <AvailableList slots={slots ?? []} selected={selectedTime} onSelect={handleSelectTime} />
            )}
          </div>
        </div>
      )}

      {/* Step 3: Booking Form */}
      {step === 3 && selectedDate && selectedTime && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900">Confirmá tu turno</h3>
              <p className="text-sm text-gray-600 mt-1">Ingresá tus datos para finalizar</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            {/* Selected appointment summary */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Turno seleccionado</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {formatDisplayDate(selectedDate)} a las {selectedTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Tu nombre y apellido"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Tu número de teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                />
              </div>

              <button
                disabled={!name.trim() || !phone.trim() || isSubmitting}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Confirmando...</span>
                  </div>
                ) : (
                  'Confirmar reserva'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages - Fixed notification */}
      {message && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-fade-in">
          <div className={`rounded-lg p-4 shadow-lg ${
            message === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : message === 'conflict'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {message === 'success' && (
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {message === 'conflict' && (
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              )}
              {message === 'error' && (
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  message === 'success' 
                    ? 'text-green-800' 
                    : message === 'conflict'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}>
                  {message === 'success' && '¡Turno reservado con éxito!'}
                  {message === 'conflict' && 'Ese turno se acaba de ocupar. Elegí otro.'}
                  {message === 'error' && 'Error al reservar. Intentá nuevamente.'}
                </p>
                <p className={`text-sm mt-1 ${
                  message === 'success' 
                    ? 'text-green-600' 
                    : message === 'conflict'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {message === 'success' && 'Te esperamos en la fecha y horario seleccionados.'}
                  {message === 'conflict' && 'Los horarios se actualizaron automáticamente.'}
                  {message === 'error' && 'Por favor, verificá tu conexión e intentá de nuevo.'}
                </p>
              </div>
              <button
                onClick={() => setMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}