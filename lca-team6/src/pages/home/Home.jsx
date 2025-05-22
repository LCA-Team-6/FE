import React, { useState, useEffect } from 'react';
import Calendar from './calendar';
import MemoList from './MemoList';
import './Home.css';
import customAxios from '../../api/customAxios';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [memoDates, setMemoDates] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState([]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 특정 날짜의 메모 불러오기
  useEffect(() => {
    const fetchSelectedMemo = async () => {
      const dateKey = formatDate(selectedDate);

      try {
        const { data } = await customAxios.get(`/memos/${dateKey}`);
        setSelectedMemo(data.data);
      } catch (error) {
        console.error('메모 내용을 불러오는데 실패했습니다:', error);
        setSelectedMemo([]);
      }
    };

    fetchSelectedMemo();
  }, [selectedDate]);

  // 월의 메모 날짜 목록 불러오기
  useEffect(() => {
    const fetchMemoDates = async () => {
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');

      try {
        const response = await customAxios.get(`/memos/${month}`);
        const memoList = response.data.data;
        const dateList = memoList.map((memo) => new Date(memo.createdAt));
        setMemoDates(dateList);
      } catch (error) {
        console.error('메모 날짜를 불러오는데 실패했습니다:', error);
        setMemoDates([]);
      }
    };

    fetchMemoDates();
  }, [selectedDate.getMonth()]);

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="home-wrapper">
      <div className="calendar-container">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          diaryDates={memoDates}
        />
      </div>
      <div className="memo-list-container">
        <MemoList
          date={selectedDate}
          memos={selectedMemo}
        />
      </div>
    </div>
  );
};

export default Home;
