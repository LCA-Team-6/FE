import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/customAxios";
import "./User.css";

export default function User() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("info");

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [joinedDate, setJoinedDate] = useState("");

  // 비밀번호
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // 탈퇴
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isVerified, setIsVerified] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/user/me");
        const { name, email, createdAt } = res.data.data;

        setNickname(name);
        setEmail(email);
        setJoinedDate(createdAt.slice(0, 10)); // YYYY-MM-DD
        setIsLoading(false);
      } catch (err) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  //닉네임변경
  const handleNicknameChange = async () => {
    try {
      await api.patch("/user", {
        name: nickname
      });
      alert("닉네임이 성공적으로 변경되었습니다.");
    } catch (err) {
      alert(err.response?.data?.message || "닉네임 변경 실패");
      console.error("닉네임 변경 실패:", err);
    }
  };

  //비밀번호변경
  const handleChangePassword = async () => {
    if (newPw !== confirmPw || newPw.length < 6) {
      alert("비밀번호가 일치하지 않거나 조건이 맞지 않습니다.");
      return;
    }

    try {
      await api.patch("/user/password", {
        oldPassword: "", // 백엔드가 현재 비밀번호 검증 안 할 경우 공란 가능
        newPassword: newPw,
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      alert(err.response?.data?.message || "비밀번호 변경 실패");
    }
  };

  //탈퇴
  const handleDelete = async () => {
    if (confirmText !== "탈퇴하겠습니다.") {
      alert('"탈퇴하겠습니다."를 정확히 입력해 주세요.');
      return;
    }

    try {
      const res = await api.delete("/user");
      alert(res.data.message || "회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "회원 탈퇴 중 오류 발생");
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
    </div>
  );
}
