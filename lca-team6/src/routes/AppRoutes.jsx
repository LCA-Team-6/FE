import { Route } from "react-router-dom";
import Example from "../pages/example/Example";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/login/Register";
import Write from "../pages/write/Write";

export default function AppRoutes() {
  return[
    
    <Route key='example' path='/example' element={<Example />} />,
    <Route key='home' path='/' element={<Home />} />,
    <Route key='login' path='/login' element={<Login />} />,
    <Route key='register' path='/register' element={<Register />} />,
    <Route key='write' path='/write' element={<Write />} />
    
  ];
}
