// src/pages/login/Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert(`로그인 : ${email}`);
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>로그인</h2>
        <input
          className="login-input"
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>
        <button
          className="text-button"
          onClick={() => navigate("/register")}
        >
          회원가입 하러 가기
        </button>
        <button
          className="text-button"
          onClick={() => alert("기능 준비 중입니다")}
        >
          아이디 / 비밀번호 찾기
        </button>
      </div>
    </div>
  );
}

export default Login;
