import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";


function NavBarShow() {
  return(
    <>
    <NavBar />
    <Outlet />
    </>
  );
}

export default NavBarShow;