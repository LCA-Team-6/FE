import React, { useState } from 'react';
import Calendar from './Calendar'
import './Home.css'

const diaryDates = [
  new Date(2025, 4, 10),
  new Date(2025, 4, 12),
];

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const hasDiary = (date) => {
    return diaryDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  return (
    <div className='home-wapper'>
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
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
