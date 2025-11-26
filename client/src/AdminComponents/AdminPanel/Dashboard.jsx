import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useStore from "../../components/Store/Store";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaBoxOpen,
  FaPlusCircle,
  FaSignOutAlt,
  FaMoon,
} from "react-icons/fa";
import adminApis from "../../components/Store/adminApi";

export default function Dashboard() {
  const { adminLogout } = adminApis();
  const {themeToggler} = useStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await adminLogout();
      if (response.success) navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt size={18} />,
      path: "/admin/dashboard",
    },
    {
      name: "Product Lists",
      icon: <FaBoxOpen size={18} />,
      path: "/admin/product",
    },
    {
      name: "Add Products",
      icon: <FaPlusCircle size={18} />,
      path: "/admin/addProduct",
    },
  ];

  return (
    <div className="flex">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-themegreen text-white p-2 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-themedark border-r dark:border-gray-400 flex flex-col justify-between transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <ul className="mt-16 lg:mt-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded m-2 text-gray-700 dark:text-gray-200 hover:bg-themegreen hover:text-white transition-all ${
                    isActive ? "bg-themegreen text-white" : ""
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 m-4 p-3 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <FaSignOutAlt size={18} /> Logout
        </button>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <button className="absolute right-5 cursor-pointer active:scale-[95%] hover:scale-[105%] bg-themegreen text-white p-3 rounded-3xl text-lg bottom-5"
      onClick={themeToggler}
      >
        <FaMoon/>
      </button>
    </div>
  );
}
