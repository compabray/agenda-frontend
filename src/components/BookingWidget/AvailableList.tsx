import React from 'react';

interface Props {
  slots: string[];
  selected: string | null;
  onSelect: (t: string) => void;
}

export default function AvailableList({ slots, selected, onSelect }: Props) {
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
    <div className="space-y-3">
      <p className="text-xs text-gray-600 font-medium">
        {slots.length === 1 ? '1 horario disponible' : `${slots.length} horarios disponibles`}
      </p>
      
      <div className="grid grid-cols-2 gap-2">
        {slots.map((time) => (
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={`relative overflow-hidden px-3 py-2.5 rounded-lg border-2 font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
              selected === time
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-105'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
            }`}
          >
            <span className="relative z-10">{time}</span>
            {selected === time && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-blue-700">
            Elegí tu horario preferido. Los turnos duran aprox. 40 min.
          </p>
        </div>
      </div>
    </div>
  );
}