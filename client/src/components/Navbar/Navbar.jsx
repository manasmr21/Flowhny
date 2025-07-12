import { useState } from "react";
import "./navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { MdSunny } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Link, NavLink,useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import useStore from "../Store/Store";
import apiStore from "../Store/apiStores";

function Navbar() {
  const [menuClose, setMenuClose] = useState(true);
  const [scrollDown, setScrollDown] = useState(0);

  const location = useLocation();
  const { cart, theme, themeToggler } = useStore();
  const { userData, userLoggedIn } = apiStore();

  window.addEventListener("scroll", () => {
    setScrollDown(window.scrollY);
  });

  return (
    <>
      <nav
        className={`nav-animate w-full transition-all ease-linear duration-300 ${
          location.pathname == "/" ? "fixed" : "sticky"
        } bg-${
          scrollDown < 50 && location.pathname == "/"
            ? "transpparent"
            : "themegreen"
        } flex justify-between items-center top-0 p-2 md:py-4 px-5 md:px-10 lg:px-20 z-10`}
        id="navbar"
      >
        <div
          className="burger flex justify-center items-center "
          onClick={() => setMenuClose(false)}
        >
          <GiHamburgerMenu className={` text-xl mt-1.5`} tabIndex={0} />
        </div>
        <div
          className={`logo dm-serif-text-regular  mt-1 text-center font-medium grid place-items-center text-3xl md:text-4xl text-${
            scrollDown < 50 && location.pathname == "/" ? "themegreen" : "white"
          } `}
        >
          <NavLink to="/" tabIndex={0}>
            flowhny.
          </NavLink>
        </div>
        <div
          className={`navigations z-10 ${
            menuClose ? "top-[-1500px]" : "top-0"
          } transition-all duration-500 ease-in-out md:w-[50%] xl:w-[40%] flex`}
        >
          <RxCross2
            className=" burger absolute top-5 left-5 text-3xl"
            onClick={() => setMenuClose(true)}
            tabIndex={0}
          />
          <ul className="flex w-full justify-between items-center h-full font-medium text-white">
            <li
              className="nav-items relative cursor-pointer "
              onClick={() => {
                setMenuClose(true);
                window.scrollTo(0, 0);
              }}
            >
              <NavLink to="/">Home</NavLink>
            </li>
            <li
              className="nav-items relative cursor-pointer "
              onClick={() => setMenuClose(true)}
            >
              <NavLink to="/products">Products</NavLink>
            </li>
            <li
              className="nav-items relative cursor-pointer "
              onClick={() => setMenuClose(true)}
            >
              <NavLink to="/about">About</NavLink>
            </li>
            <li
              className="nav-items relative cursor-pointer "
              onClick={() => setMenuClose(true)}
            >
              <NavLink to="/contact">Contact</NavLink> us
            </li>
          </ul>
        </div>
        <div className=" flex justify-center items-centers rounded-2xl">
          { <button
            className={`cursor-pointer relative z-0 rounded-lg md:rounded-xl ${
              scrollDown < 50 && location.pathname == "/"
                ? "text-themegreen"
                : "text-white"
            } transition px-1.5  md:px-2.5 md:text-xl  `}
          >
            <Link to="/cart"><FaShoppingCart /></Link>
            <span className={`absolute ${cart.length > 0 && userLoggedIn ? "block" : "hidden" } border border-[red] text-white rounded-3xl px-1 top-[-4px] left-[-2px] bg-red-600 text-xs`}>
              {cart.length}
            </span>
          </button>}

          <button
            className={`cursor-pointer rounded-lg md:rounded-xl md:p-2   transition bg-transparent ${
              scrollDown < 50 && location.pathname == "/"
                ? "text-themegreen hover:bg-themegreen hover:text-white"
                : "text-white hover:bg-white hover:text-themegreen"
            } p-1.5 md:text-2xl mx-2.5`}
            onClick={themeToggler}
          >
            {theme == "dark" ? <MdSunny /> : <BsFillMoonStarsFill />}
          </button>

          {!userData ? (
            <button
              className={`cursor-pointer rounded-lg md:rounded-xl ${
                scrollDown < 50 && location.pathname == "/"
                  ? "text-[#fff] bg-themegreen hover:bg-transparent hover:text-themegreen "
                  : "text-themegreen bg-white hover:bg-transparent hover:text-white "
              } transition px-1.5  md:px-2.5 md:text-xl  `}
            >
              <Link to="/login">
                <IoPerson />
              </Link>
            </button>
          ) : (
            <Link to="/profile"
              className={`border-2 cursor-pointer grid place-items-center w-[40px] h-[40px] rounded-4xl font-semibold px-2.5 ${
                scrollDown < 50 && location.pathname == "/" ? "text-themegreen" : "text-white"
              } `}
            >
              {userData?.username[0]}
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
