import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './Calendar.css';

const diaryDates = [
  new Date(2025, 4, 10),
  new Date(2025, 4, 12),
];

const Calendar = ({ selectedDate, onDateSelect }) => {
  return (
    <div className="calendar-wrapper">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        modifiers={{
          hasDiary: diaryDates,
        }}
        modifiersClassNames={{
          hasDiary: 'has-diary',
          today: 'today',
        }}
      />
    </div>
  );
};

export default Calendar;
