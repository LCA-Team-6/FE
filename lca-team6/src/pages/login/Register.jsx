// src/pages/register/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);

  const validate = () => {
    if (name.trim().length < 2) {
      setError("닉네임은 2자 이상이어야 해요.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("이메일 형식이 올바르지 않아요.");
      return false;
    }

    if (!emailChecked) {
      setError("이메일 중복 확인을 해주세요.");
      return false;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 해요.");
      return false;
    }

    if (password !== confirm) {
      setError("비밀번호가 일치하지 않아요.");
      return false;
    }

    setError("");
    return true;
  };

  const handleEmailCheck = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("이메일 형식이 올바르지 않아요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/email", { email });
      alert("사용 가능한 이메일입니다.");
      setEmailChecked(true);
      setError("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("이미 사용 중인 이메일이에요.");
        setEmailChecked(false);
      } else {
        setError("서버에 연결할 수 없습니다.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const { data } = await axios.post("http://localhost:8080/api/auth/signup", {
        email,
        password,
        name
      });

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError("회원가입에 실패했습니다.");
      } else {
        setError("서버와 연결할 수 없습니다.");
      }
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2>회원가입</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          className="register-input"
          type="text"
          placeholder="닉네임"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="input-row">
          <input
            className="register-input"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailChecked(false);
            }}
          />
          <button className="register-button" type="button" onClick={handleEmailCheck}>
            중복확인
          </button>
        </div>
        <input
          className="register-input"
          type="password"
          placeholder="비밀번호 (8자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="register-input"
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button className="register-button" onClick={handleSubmit}>
          가입하기
        </button>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
      </div>
    </div>
  );
}

export default Register;
