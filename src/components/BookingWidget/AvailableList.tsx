import React from 'react';
import type { SlotWithStatus } from './types';

interface Props {
  slots: SlotWithStatus[];
  selected: string | null;
  onSelect: (t: string) => void;
}

export default function AvailableList({ slots, selected, onSelect }: Props) {
  const availableSlots = slots.filter(slot => slot.available);
  const occupiedSlots = slots.filter(slot => !slot.available);
  
  if (!slots.length) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">Sin turnos disponibles</p>
        <p className="text-gray-400 text-xs mt-1">Probá con otro día</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between text-xs">
        <p className="text-gray-600 font-medium">
          {availableSlots.length === 1 
            ? '1 horario disponible' 
            : `${availableSlots.length} horarios disponibles`
          }
        </p>
        {occupiedSlots.length > 0 && (
          <p className="text-gray-400">
            {occupiedSlots.length} ocupados
          </p>
        )}
      </div>
      
      {/* Slots Grid */}
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => slot.available && onSelect(slot.time)}
            disabled={!slot.available}
            className={`relative overflow-hidden px-3 py-3 rounded-lg border-2 font-medium text-sm transition-all duration-200 ${
              !slot.available
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                : selected === slot.time
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-105 transform hover:scale-105'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transform hover:scale-105'
            }`}
          >
            <span className="relative z-10 block">
              {slot.time}
              {!slot.available && (
                <>
                  <span className="block text-xs mt-1 text-gray-400">Ocupado</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                </>
              )}
            </span>
            {selected === slot.time && slot.available && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-700">
            <p>Elegí tu horario preferido. Los turnos duran aprox. 40 min.</p>
            {occupiedSlots.length > 0 && (
              <p className="mt-1 text-gray-600">
                Los horarios marcados con ✕ ya están ocupados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}