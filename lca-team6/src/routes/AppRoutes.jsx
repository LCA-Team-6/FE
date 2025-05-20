import { Route } from "react-router-dom";
import Example from "../pages/example/Example";

export default function AppRoutes() {
  return [
    <Route key='example' path='/example' element={<Example />} />,
  ];
}
