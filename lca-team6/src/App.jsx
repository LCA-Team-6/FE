import { BrowserRouter, Routes } from "react-router-dom";
import { Global } from "@emotion/react";
import { GlobalStyle } from "./styles/globalStyle";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./nav/NavBar";

function App() {
  return (
    <BrowserRouter>
      <Global styles={GlobalStyle} />
      <NavBar />
      <Routes>
        {AppRoutes()}
      </Routes>
    </BrowserRouter>
  );
}

export default App;