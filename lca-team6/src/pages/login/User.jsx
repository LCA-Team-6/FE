import { useState } from "react";
import "./User.css";

function User() {
  const [verified, setVerified] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [pwInput, setPwInput] = useState("");

  // 더미 유저 정보
  const user = {
    email: "user@example.com",
    nickname: "홍길동",
    createdAt: "2024-02-10",
  };

  const [nickname, setNickname] = useState(user.nickname);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [withdrawPw, setWithdrawPw] = useState("");
  const [withdrawConfirmText, setWithdrawConfirmText] = useState("");

  const handlePasswordVerify = () => {
    if (pwInput === "11") {
      setVerified(true);
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleTabClick = (tab) => {
    if (!verified) {
      alert("비밀번호를 먼저 확인해주세요.");
      return;
    }
    setActiveTab(tab);
  };

  const handleNicknameChange = () => {
    alert("닉네임이 변경되었습니다.");
    // 닉네임 변경 API 호출 위치
  };

  const handlePasswordChange = () => {
    if (newPw !== confirmPw) {
      alert("새 비밀번호가 일치하지 않습니다.");
    } else {
      alert("비밀번호가 변경되었습니다.");
    }
  };

  const handleWithdraw = () => {
    if (withdrawPw === "correctPassword" && withdrawConfirmText === "탈퇴하겠습니다.") {
      alert("회원 탈퇴가 완료되었습니다.");
    } else {
      alert("비밀번호 또는 입력 문구가 올바르지 않습니다.");
    }
  };

  return (
    <div className="user-container">
      <div className="sidebar">
        <h3>마이페이지</h3>
        <ul>
          <li onClick={() => handleTabClick("info")} className={activeTab === "info" ? "active" : ""}>회원정보 수정</li>
          <li onClick={() => handleTabClick("password")} className={activeTab === "password" ? "active" : ""}>비밀번호 변경</li>
          <li onClick={() => handleTabClick("withdraw")} className={activeTab === "withdraw" ? "active" : ""}>회원 탈퇴</li>
        </ul>
      </div>

      <div className="editor">
        {!verified ? (
          <>
            <h2>비밀번호 확인</h2>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
            />
            <button className="save-btn" onClick={handlePasswordVerify}>확인</button>
          </>
        ) : activeTab === "info" ? (
          <>
            <h2>회원정보 수정</h2>
            <div className="option-group">
              <label>이메일</label>
              <div className="readonly-box">{user.email}</div>
            </div>
            <div className="option-group">
              <label>닉네임</label>
              <div className="inline-row">
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                <button className="save-btn" onClick={handleNicknameChange}>변경하기</button>
              </div>
            </div>
            <div className="option-group">
              <label>가입일자</label>
              <div className="readonly-box">{user.createdAt}</div>
            </div>
          </>
        ) : activeTab === "password" ? (
          <>
            <h2>비밀번호 변경</h2>
            <div className="option-group">
              <label>현재 비밀번호</label>
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
            </div>
            <div className="option-group">
              <label>새 비밀번호</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            </div>
            <div className="option-group">
              <label>비밀번호 확인</label>
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
            </div>
            <button className="save-btn" onClick={handlePasswordChange}>변경하기</button>
          </>
        ) : (
          <>
            <h2>회원 탈퇴</h2>
            <div className="option-group">
              <label>비밀번호 확인</label>
              <input type="password" value={withdrawPw} onChange={(e) => setWithdrawPw(e.target.value)} />
            </div>
            {withdrawPw === "correctPassword" && (
              <>
                <div className="option-group">
                  <label>'탈퇴하겠습니다.' 입력</label>
                  <input type="text" value={withdrawConfirmText} onChange={(e) => setWithdrawConfirmText(e.target.value)} />
                </div>
                <button
                  className="save-btn"
                  onClick={handleWithdraw}
                  disabled={withdrawConfirmText !== "탈퇴하겠습니다."}
                >
                  탈퇴하기
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default User;
