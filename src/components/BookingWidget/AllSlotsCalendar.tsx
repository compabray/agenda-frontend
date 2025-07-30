import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';

import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';

interface Props { onSelectDate: (date: string) => void }

export default function AllSlotsCalendar({ onSelectDate }: Props) {
  const ref = useRef<FullCalendar | null>(null);

  const handleClick = (info: any) => {
    const cell = info.dayEl as HTMLElement;

    // bloquear días pasados o celdas deshabilitadas
    if (cell.classList.contains('fc-day-past')) return;

    // elimina highlight anterior
    document
      .querySelectorAll('.selected-day')
      .forEach((el) => el.classList.remove('selected-day'));

    // aplica highlight actual
    cell.classList.add('selected-day');

    onSelectDate(format(info.date, 'yyyy-MM-dd'));
  };

  return (
    <FullCalendar
      ref={ref}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next',
        center: 'title',
        right: ''
      }}
      firstDay={1}
      height="auto"
      selectable
      dateClick={handleClick}
      locale={esLocale}
      dayMaxEventRows={0}
      showNonCurrentDates
      fixedWeekCount={false}
    />
  );
}