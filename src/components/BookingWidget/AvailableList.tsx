import React from 'react';

interface Props { slots: string[]; onSelect: (t: string) => void; }

export default function AvailableList({ slots, onSelect }: Props) {
  if (!slots.length) {
    return <p className="text-gray-500 text-sm">No hay turnos disponibles hoy.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {slots.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className="py-2 border-2 border-amber-500 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors text-sm"
        >
          {t}
        </button>
      ))}
    </div>
  );
}
