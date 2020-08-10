import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  // estado del menu
  const [toggle, setToggle] = useState(true);

  // para desplegar el menu en pantallas pequeñas
  const isOpen = () => {
    const menu = document.getElementById("menu-toggle");
    return toggle
      ? (setToggle(false), menu.classList.remove("hidden"))
      : (setToggle(true), menu.classList.add("hidden"));
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-white p-4 sticky top-0">
      <div className="flex items-center flex-shrink-0 mr-5">
        <Link className="font-semibold text-xl tracking-tight" to="/">
          Note App
        </Link>
      </div>
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-purple-900 border-purple-900 hover:text-purple-900 hover:border-purple-900"
          onClick={isOpen}
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className="w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden"
        id="menu-toggle"
      >
        <div className="text-sm lg:flex-grow lg:flex justify-end">
          <Link
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-600 hover:text-purple-900 mx-4 font-semibold"
            to="/"
          >
            Notes
          </Link>
          <Link
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-600 hover:text-purple-900 mx-4 font-semibold"
            to="create"
          >
            Create Note
          </Link>
          <Link
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-600 hover:text-purple-900 mx-4 font-semibold"
            to="/user"
          >
            Create User
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
