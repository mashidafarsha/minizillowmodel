"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { useSelector } from "react-redux";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  console.log("Redux user:", user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleFavoritesClick = (e) => {
    e.preventDefault();
    if (user) {
      router.push("/favorites");
    } else {
      router.push("/login");
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full z-40">
      <div className="flex justify-center font-sf-pro ">
        <div className="header w-full px-10  lg:px-20 py-4 flex flex-row justify-between items-center">
          <div className="text-xl font-bold text-[#333333]">Zillow Mini</div>

          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#333333] text-2xl focus:outline-none"
            >
              ☰
            </button>
          </div>

          <ul className="hidden sm:flex space-x-6 text-[16px] font-medium text-[#333333]">
            <li>
              <a href="/" className="hover:text-blue-200 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-200 transition">
                About
              </a>
            </li>
            <li>
              <a
                href="/allProperties"
                className="hover:text-blue-200 transition"
              >
                Properties
              </a>
            </li>

            <li>
              <button
                onClick={handleFavoritesClick}
                className="hover:text-blue-200 transition bg-transparent border-none p-0 text-left"
              >
                Favorites
              </button>
            </li>

            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-200 transition"
                >
                  Logout
                </button>
              </li>
            )}

            <li>
              <a href="/signup" className="hover:text-blue-200 transition">
                Signup
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden px-4 pb-4">
          <ul className="flex flex-col space-y-4 text-black text-[16px] font-medium">
            <li>
              <a href="/" className="hover:text-blue-200 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-200 transition">
                About
              </a>
            </li>
            <li>
              <a
                href="/allProperties"
                className="hover:text-blue-200 transition"
              >
                Properties
              </a>
            </li>

            <li>
              <button
                onClick={handleFavoritesClick}
                className="hover:text-blue-200 transition bg-transparent border-none p-0 text-left"
              >
                Favorites
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="hover:text-blue-200 transition"
              >
                Logout
              </button>
            </li>
            <li>
              <a href="/signup" className="hover:text-blue-200 transition">
                Signup
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;
