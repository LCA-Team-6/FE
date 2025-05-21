import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Test.css";
import axios from "axios"

const Test = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [sending, setSending] = useState(false);

    const navigate = useNavigate();

    const signUpBtn = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // 사용자 정보 JSON 
        const userInfo = JSON.stringify({ email, password, name });

        try {
            const response = await axios.post("http://localhost:8080" + '/api/auth/signup', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                alert('똑똑! 환영합니다. 로그인 페이지로 이동합니다.');
                console.log(response);

            } else if (response.status === 409) {
                alert('이미 가입된 회원정보(이메일) 입니다.')
            } else {
                alert('회원가입에 실패했습니다. 관리자에게 문의하세요.')
                console.error('회원가입 실패');
            }
        } catch (error) {
            alert('회원가입에 실패했습니다. 관리자에게 문의하세요.')
            console.error('sign up error:', error);
        }
    };

    const handleEmailVerified = () => {
        setEmailVerified(true);
    };

    const fileAttach = (e) => {
        setProfileImg(e.target.files[0]);
    };

    return (
        <div className="page">

            <div className="titleWrap">
                Sign up
            </div>
            
            <div className="emailInput">
                <div className="inputWrap">
                    <span style={{color: 'red'}}>*</span>
                    <input type="text" className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
            </div>

            <div className="passwordInput">
                <div className="inputWrap">
                    <span style={{color: 'red'}}>*</span>
                    <input type="password" className="input" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
            </div>

            <div className="userInput">
                <div className="inputWrap">
                    <span style={{color: 'red'}}>*</span>
                    <input type="text" className="input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
                </div>
            </div>

            <button className="signUpBtn" onClick={signUpBtn}>
                Sign up
            </button>
            
        </div>
    )
}

export default Test;