import React, { useState, useEffect } from 'react';
import Calendar from './calendar'
import './Home.css'
import axios from 'axios';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [memoDates, setMemoDates] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);

  // 월별 메모 날짜 목록 가져오기
  useEffect(() => {
    const fetchMemoDates = async () => {
      try {
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const { data } = await axios.get(`/api/memos/${month}`);
        const dates = data.map(memo => new Date(memo.createdAt));
        setMemoDates(dates);
      } catch (error) {
        console.error('메모 날짜를 불러오는데 실패했습니다:', error);
      }
    };

    fetchMemoDates();
  }, [selectedDate]);

  // 선택된 날짜의 메모 내용 가져오기
  useEffect(() => {
    const fetchSelectedMemo = async () => {
      if (!selectedDate) return;
      
      try {
        const date = selectedDate.toISOString() // YYYY-MM-DD 형식
        const { data } = await axios.get(`/api/memos/${date}`);
        setSelectedMemo(data);
      } catch (error) {
        console.error('메모 내용을 불러오는데 실패했습니다:', error);
        setSelectedMemo(null);
      }
    };

    fetchSelectedMemo();
  }, [selectedDate]);

  const hasMemo = (date) => {
    return memoDates.some(
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
        diaryDates={memoDates}
      />

      <div>
        {selectedDate ? (
          hasMemo(selectedDate) ? (
            <div>
              <p><strong>{selectedDate.toDateString()}</strong>의 메모:</p>
              {selectedMemo ? (
                <ul>
                  {selectedMemo.map(memo => (
                    <li key={memo.memoId}>{memo.content}</li>
                  ))}
                </ul>
              ) : (
                <p>메모를 불러오는 중...</p>
              )}
            </div>
          ) : (
            <p><strong>{selectedDate.toDateString()}</strong>: 작성된 메모가 없습니다.</p>
          )
        ) : (
          <p>날짜를 선택해 주세요.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
