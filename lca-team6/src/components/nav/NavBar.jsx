import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import "./NavBar.css";
import Logo from "../logo/Logo";

const NavBar = () =>{
    const location = useLocation();
    const navigate = useNavigate();
    
    const routes = [
        { name: "글쓰기", path:"/write" },
        { name: "홈", path:"/" },
        { name: "마이 페이지", path:"/user" },
        { name: "개인 설정", path:"/prompts" },
        { name: "로그아웃", path:"/login" }
    ];
    return(
        <div className="nav-bar-container">
            <Logo />
            <nav className="nav-bar">
                {routes.filter(route => route.path !== location.pathname)
                .map(route => (
                    <button
                        key={route.path}
                        className="nav-button"
                        onClick={() => navigate(route.path)}
                        >{route.name}</button>
                ))}
            </nav>
        </div>
    );
}

export default NavBar;