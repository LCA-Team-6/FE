// src/pages/login/Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.data.token);        
        
        alert("로그인 성공! 어서오세요.");
        navigate("/"); // 홈 페이지로 이동
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
      } else {
        alert("서버와 연결할 수 없습니다. 다시 시도해주세요.");
      }
      console.error("Login error:", error);
    }
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
