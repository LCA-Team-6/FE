import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './Calendar.css';

const Calendar = ({ selectedDate, onDateSelect, diaryDates }) => {
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
