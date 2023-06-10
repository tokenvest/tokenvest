import ConnectWallet from "./ConnectWallet";
import { useNavigate } from "react-router-dom";

const Navbar = ({ lightText = true }) => {
  const navigate = useNavigate();
  const textColorClass = lightText ? "text-white" : "text-black";
  return (
    <div
      className={`navbar bg-transparent shadow-md fixed top-0 w-full z-50 ${textColorClass}`}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-500 rounded-box w-52"
          >
            <li>
              <a>Marketplace</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2  bg-transparent">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Dashboard</a>
            </li>
          </ul>
        </div>
        <a
          className="btn btn-ghost normal-case font-bold text-xl"
          onClick={() => navigate("/")}
        >
          TokenVest
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 ">
          <li>
            <a>Marketplace</a>
          </li>
          <li tabIndex={0} className="bg-transparent">
            <details className="bg-transparent">
              <summary className="">Parent</summary>
              <ul className="p-2 ">
                <li>
                  <a className="text-black">Submenu 1</a>
                </li>
                <li>
                  <a className="text-black">Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a>Dashboard</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Navbar;
