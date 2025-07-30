import React from 'react';

interface Props {
  slots: string[];
  selected: string | null;
  onSelect: (t: string) => void;
}

export default function AvailableList({ slots, selected, onSelect }: Props) {
  if (!slots.length) return <p className="text-gray-500 text-sm">No hay turnos disponibles hoy.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {slots.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={`btn-slot ${selected === t ? 'btn-slot-selected' : ''}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
