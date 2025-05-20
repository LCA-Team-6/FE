import React, { useState } from 'react';
import Calendar from './calendar'
import './Home.css'

// 임시 일기 있는 날짜
const diaryDates = [
  new Date(2025, 4, 2),
  new Date(2025, 4, 6),
  new Date(2025, 4, 10),
  new Date(2025, 4, 12),
  new Date(2025, 4, 13),
  new Date(2025, 4, 14),
  new Date(2025, 4, 15),
  new Date(2025, 4, 22),
];

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const hasDiary = (date) => {
    return diaryDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className='home-wapper'>
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        diaryDates={diaryDates}
      />

      <div >
        {selectedDate ? (
          hasDiary(selectedDate) ? (
            <p><strong>{selectedDate.toDateString()}</strong>: 이 날 작성한 일기 내용</p>
          ) : (
            <p><strong>{selectedDate.toDateString()}</strong>: 작성된 일기가 없습니다.</p>
          )
        ) : (
          <p>날짜를 선택해 주세요.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
