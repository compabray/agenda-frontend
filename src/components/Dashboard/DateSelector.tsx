// src/components/Dashboard/DateSelector.tsx
import React from 'react';
import { format, addDays, subDays, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: Props) {
  const today = startOfToday();
  const currentDate = new Date(selectedDate + 'T00:00:00');

  const goToPreviousDay = () => {
    const prevDay = subDays(currentDate, 1);
    onDateChange(format(prevDay, 'yyyy-MM-dd'));
  };

  const goToNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    onDateChange(format(nextDay, 'yyyy-MM-dd'));
  };

  const goToToday = () => {
    onDateChange(format(today, 'yyyy-MM-dd'));
  };

  const formatDisplayDate = (date: Date) => {
    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    const isTomorrow = format(date, 'yyyy-MM-dd') === format(addDays(today, 1), 'yyyy-MM-dd');
    const isYesterday = format(date, 'yyyy-MM-dd') === format(subDays(today, 1), 'yyyy-MM-dd');

    if (isToday) return 'Hoy';
    if (isTomorrow) return 'Mañana';
    if (isYesterday) return 'Ayer';
    
    return format(date, "EEEE d 'de' MMMM", { locale: es });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousDay}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Día anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 text-center">
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {formatDisplayDate(currentDate)}
          </h2>
          <p className="text-sm text-gray-500">
            {format(currentDate, 'dd/MM/yyyy')}
          </p>
        </div>

        <button
          onClick={goToNextDay}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Día siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={goToToday}
          className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors font-medium"
        >
          Ir a hoy
        </button>
      </div>
    </div>
  );
}