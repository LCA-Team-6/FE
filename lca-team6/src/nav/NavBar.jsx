import {useLocation, useNavigate} from "react-router-dom";

const NavBar = () =>{
    const location = useLocation();
    const navigate = useNavigate();
    
    const routes = [
        { name: "글쓰기", path:"/write" },
        { name: "홈", path:"/" },
        { name: "개인 설정", path:"/" },
        { name: "마이페이지", path:"/" },
        { name: "로그아웃", path:"/" },
    ];
    return(
        <nav className="nav-bar">
            {/* 해당 패이지에 들어가면 페이지에 해당하는 버튼을 빼고 보여줌 */}
            {routes.filter(route => route.path !== location.pathname)
            .map(route => (
                <button
                    key={route.path}
                    className="nav-button"
                    onClick={() => navigate(route.path)}
                    >{route.name}</button>
            ))}
        </nav>
    );
}

export default NavBar;