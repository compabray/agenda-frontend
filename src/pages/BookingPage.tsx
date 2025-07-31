import React from 'react';
import BookingWidget from '../components/BookingWidget';
import { BUSINESS_ID } from '../constants';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header con gradiente */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Reservá tu turno
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-xl text-blue-100">
              Elegí el día y horario que mejor te convenga. Simple, rápido y seguro.
            </p>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-6 text-slate-50" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative -mt-6 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
            <div className="p-8 sm:p-12">
              <BookingWidget businessId={BUSINESS_ID} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="mt-16 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              ¿Necesitás cancelar o reprogramar? Contactanos al teléfono de la clínica
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}