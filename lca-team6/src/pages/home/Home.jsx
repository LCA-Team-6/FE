import React, { useState, useEffect } from 'react';
import Calendar from './calendar';
import MemoList from './MemoList';
import './Home.css';
// import customAxios from '../../api/customAxios';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [memoDates, setMemoDates] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState([]);

  // 더미 데이터
  const dummyMemoMap = {
    '2025-05-20': [
      {
        memoId: 1,
        memo: '사용자 작성 글 1',
        analysis: 'ai 분석 답변 1',
      },
      {
        memoId: 2,
        memo: '사용자 작성 글 2',
        analysis: null,
      },
    ],
    '2025-05-21': [
      {
        memoId: 3,
        memo: '사용자 작성 글 3',
        analysis: 'ai 분석 답변 3',
      },
    ],
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 선택한 날짜의 메모 불러오기
  useEffect(() => {
    const fetchSelectedMemo = async () => {
      if (!selectedDate) return;

      const dateKey = formatDate(selectedDate);

      // 실제 API 요청
      // const { data } = await customAxios.get(`/memos/${dateKey}`);
      // setSelectedMemo(data);

      // 더미 데이터
      if (dummyMemoMap[dateKey]) {
        setSelectedMemo(dummyMemoMap[dateKey]);
      } else {
        setSelectedMemo([]);
      }
    };

    fetchSelectedMemo();
  }, [selectedDate]);

  // 메모가 존재하는 날 표시
  useEffect(() => {
    const memoDates = Object.keys(dummyMemoMap).map((dateStr) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    });
    setMemoDates(memoDates);
  }, []);

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
        <MemoList date={selectedDate} memos={selectedMemo} />
      </div>
    </div>
  );
};

export default Home;
