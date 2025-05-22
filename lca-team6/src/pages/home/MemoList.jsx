// MemoList.jsx
import React from 'react';
import './MemoList.css';

const MemoList = ({ date, memos }) => {
  if (!memos || memos.length === 0) {
    return (
      <div className="memo-list-container">
        <p><strong>{date.toDateString()}</strong> : 작성된 글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="memo-list-container">
      <p><strong>{date.toDateString()}</strong></p>
      <ul>
        {memos.map((memo) => (
          <li key={memo.memoId} className="memo-item">
            <div className="memo-content">
              <p>{memo.memo}</p>
            </div>
            {memo.analysis && (
              <div className="analysis-content">
                <p>{memo.analysis}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoList;
