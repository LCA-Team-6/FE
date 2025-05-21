import { Route } from "react-router-dom";
import Example from "../pages/example/Example";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/login/Register";
import Write from "../pages/write/Write";
import Prompts from "../pages/prompts/Prompts";
import NavBarShow from "../nav/NavBarShow";

const AppRoutes = [
  // 네비게이션 버튼 보이는 페이지
  <Route element={<NavBarShow />} key="layout">
    <Route path='/' element={<Home />} />
    <Route path='/example' element={<Example />} />
    <Route path='/write' element={<Write />} />
    <Route path='/prompts' element={<Prompts />} />
  </Route>,
  // 네비게이션 버튼 안보이는 페이지
  <Route path='/login' element={<Login />} key="login" />,
  <Route path='/register' element={<Register />} key="register" />,
];

export default AppRoutes;