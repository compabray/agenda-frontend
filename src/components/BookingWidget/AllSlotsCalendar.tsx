import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';

import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';

interface Props { onSelectDate: (date: string) => void }

export default function AllSlotsCalendar({ onSelectDate }: Props) {
  return (
    <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        firstDay={1}
        height="auto"
        headerToolbar={{
        left: 'prev,next',
        center: 'title',
        right: ''
    }}          

        locale={esLocale}
      selectable
      dateClick={(info) => onSelectDate(format(info.date, 'yyyy-MM-dd'))}
      dayCellClassNames={({ isPast, date }) => [
        'cursor-pointer text-sm',
        isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-amber-50',
      ]}
      dayCellDidMount={(arg) => {
        // día seleccionado -> ring amber
        arg.el.classList.remove('fc-day-today');
      }}
    />
  );
}
