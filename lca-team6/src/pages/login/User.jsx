import React, { useState } from "react";
import "./User.css";

export default function User() {
  const [isVerified, setIsVerified] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("info");

  // 회원정보 수정 관련
  const [nickname, setNickname] = useState("기존닉네임"); // 예시
  const email = "user@example.com";
  const joinedDate = "2024-01-15";

  // 비밀번호 변경 관련
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [isCurrentPwValid, setIsCurrentPwValid] = useState(false);

  // 회원 탈퇴 관련
  const [confirmText, setConfirmText] = useState("");

  const handleVerifyPassword = () => {
    // 임시 비밀번호 검증 (실제론 API 호출)
    if (passwordCheck === "11") {
      setIsVerified(true);
    } else {
      alert("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleNicknameChange = () => {
    alert("닉네임이 변경되었습니다.");
    // API 요청 가능
  };

  const handleCurrentPwCheck = () => {
    if (currentPw === "11") {
      setIsCurrentPwValid(true);
    } else {
      alert("현재 비밀번호가 일치하지 않습니다.");
    }
  };

  const handleChangePassword = () => {
    if (newPw === confirmPw && newPw.length >= 6) {
      alert("비밀번호가 변경되었습니다.");
      // API 요청 가능
    } else {
      alert("비밀번호가 일치하지 않거나 조건이 맞지 않습니다.");
    }
  };

  const handleDelete = () => {
    if (confirmText === "탈퇴하겠습니다.") {
      alert("회원 탈퇴 처리되었습니다.");
      // API 호출 및 로그아웃 처리
    }
  };

  return (
    <div className="user-container">
      <div className="sidebar">
        <h3>마이페이지</h3>
        <ul>
          <li onClick={() => setSelectedMenu("info")}>회원정보 수정</li>
          <li onClick={() => setSelectedMenu("password")}>비밀번호 변경</li>
          <li onClick={() => setSelectedMenu("delete")}>회원 탈퇴</li>
        </ul>
      </div>

      {!isVerified ? (
        <div className="editor">
          <h2>비밀번호 확인</h2>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          <button className="save-btn" onClick={handleVerifyPassword}>
            확인
          </button>
        </div>
      ) : (
        <>
          {selectedMenu === "info" && (
            <div className="editor">
              <h2>회원정보 수정</h2>

              <div className="option-group">
                <label>이메일</label>
                <div className="readonly-box">{email}</div>
              </div>

              <div className="option-group">
                <label>닉네임</label>
                <div className="nickname-box">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <button onClick={handleNicknameChange}>변경하기</button>
                </div>
              </div>

              <div className="option-group">
                <label>가입일자</label>
                <div className="readonly-box">{joinedDate}</div>
              </div>
            </div>
          )}

          {selectedMenu === "password" && (
            <div className="editor">
              <h2>비밀번호 변경</h2>

              {!isCurrentPwValid ? (
                <div className="option-group">
                  <label>현재 비밀번호</label>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                  />
                  <button onClick={handleCurrentPwCheck}>확인</button>
                </div>
              ) : (
                <>
                  <div className="option-group">
                    <label>새 비밀번호</label>
                    <input
                      type="password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                    />
                  </div>
                  <div className="option-group">
                    <label>비밀번호 확인</label>
                    <input
                      type="password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                    />
                  </div>
                  <button className="save-btn" onClick={handleChangePassword}>
                    변경하기
                  </button>
                </>
              )}
            </div>
          )}

          {selectedMenu === "delete" && (
            <div className="editor">
              <h2>회원 탈퇴</h2>

              <div className="option-group">
                <label>주의사항</label>
                <div className="warning-box">
                  탈퇴 시 모든 정보가 삭제되며 복구가 불가능합니다. 신중하게 선택해 주세요.
                </div>
              </div>

              <div className="option-group">
                <label>"탈퇴하겠습니다."를 입력하세요</label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
              </div>

              <button
                className="save-btn"
                onClick={handleDelete}
                disabled={confirmText !== "탈퇴하겠습니다."}
              >
                탈퇴하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
