import { useState } from "react";
import "./navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Navbar() {
  const [menuClose, setMenuClose] = useState(true);
  const [scrollDown, setScrollDown] = useState(0);

  const location = useLocation()

  

  window.addEventListener("scroll", ()=>{
    setScrollDown(window.scrollY)
  })


  return (
    <>
      <nav className={ `nav-animate w-full transition-all ease-linear duration-300 ${location.pathname == "/" ? "fixed" : "sticky" } bg-${scrollDown < 50 && location.pathname == "/"  ? "transpparent" : "themegreen" } flex justify-between items-center top-0 p-2 md:py-4 px-5 md:px-10 lg:px-20 z-10`} id="navbar">
        <div
          className="burger flex justify-center items-center "
          onClick={() => setMenuClose(false)}
        >
          <GiHamburgerMenu className={` text-3xl mt-1.5`} tabIndex={0} />
        </div>
        <div className={`logo dm-serif-text-regular  mt-1 text-center font-medium grid place-items-center text-3xl md:text-4xl text-${scrollDown < 50 && location.pathname == "/" ? "themegreen" : "white" } `}>
          <NavLink to="/" tabIndex={0}>flowhny.</NavLink>
        </div>
        <div
          className={`navigations ${
            menuClose ? "top-[-1500px]" : "top-0"
          } transition-all duration-500 ease-in-out md:w-[50%] xl:w-[40%] flex`}
        >
          <RxCross2
            className=" burger absolute top-5 left-5 text-3xl"
            onClick={() => setMenuClose(true)}
            tabIndex={0}
          />
          <ul className="flex w-full justify-between items-center h-full font-medium text-white">
            <li className="nav-items relative cursor-pointer " onClick={()=>setMenuClose(true)}><NavLink to="/">Home</NavLink></li>
            <li className="nav-items relative cursor-pointer " onClick={()=>setMenuClose(true)}><NavLink to="/products">Products</NavLink></li>
            <li className="nav-items relative cursor-pointer " onClick={()=>setMenuClose(true)}><NavLink to="/">Services</NavLink></li>
            <li className="nav-items relative cursor-pointer " onClick={()=>setMenuClose(true)}><NavLink to="/about">About</NavLink></li>
            <li className="nav-items relative cursor-pointer " onClick={()=>setMenuClose(true)}><NavLink to="/">Contact</NavLink> us</li>
          </ul>
        </div>
        <div className=" rounded-2xl">
          <button className={`cursor-pointer mt-1 rounded-xl p-2   transition bg-transparent ${scrollDown < 50 && location.pathname == "/" ? "text-themegreen hover:bg-themegreen hover:text-white" : "text-white hover:bg-white hover:text-themegreen" } text-2xl mx-2.5`}>
            <BsFillMoonStarsFill />
          </button>
          <button className={`cursor-pointer rounded-xl ${scrollDown < 50 && location.pathname == "/" ? "text-[#fff] bg-themegreen hover:bg-transparent hover:text-themegreen " : "text-themegreen bg-white hover:bg-transparent hover:text-white " } transition  p-2 text-2xl  `}>
            <IoPerson />
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
