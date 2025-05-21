import { BrowserRouter, Routes } from "react-router-dom";
import { Global } from "@emotion/react";
import { GlobalStyle } from "./styles/globalStyle";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Global styles={GlobalStyle} />
      <Routes>
        {AppRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;