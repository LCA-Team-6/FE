import { Route } from "react-router-dom";
import Example from "../pages/example/Example";
import Home from "../pages/home/Home";
import Write from "../pages/write/Write";

export default function AppRoutes() {
  return [
    <Route key='example' path='/example' element={<Example />} />,
    <Route key='home' path='/' element={<Home />} />,
    <Route key='write' path='/write' element={<Write />} />,

  ];
}
