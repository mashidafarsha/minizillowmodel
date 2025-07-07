"use client";

import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full z-40">
      <div className="flex justify-center font-sf-pro ">
      <div className="header w-full px-10  lg:px-20 py-4 flex flex-row justify-between items-center">


          {/* Left: Logo */}
          <div className="text-xl font-bold text-[#333333]">
            Dr. Shafeek
          </div>

          {/* Right: Hamburger for Mobile */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#333333] text-2xl focus:outline-none"
            >
              ☰
            </button>
          </div>

          {/* Nav Links - Desktop */}
          <ul className="hidden sm:flex space-x-6 text-[16px] font-medium text-[#333333]">
            <li><a href="/" className="hover:text-blue-200 transition">Home</a></li>
            <li><a href="/about" className="hover:text-blue-200 transition">About</a></li>
            <li><a href="/procedures" className="hover:text-blue-200 transition">Procedures</a></li>
            <li><a href="/testimonials" className="hover:text-blue-200 transition">Testimonials</a></li>
            <li><a href="/blog" className="hover:text-blue-200 transition">Blog</a></li>
            <li><a href="/contact" className="hover:text-blue-200 transition">Contact</a></li>
            <li><a href="/signup" className="hover:text-blue-200 transition">Signup</a></li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden px-4 pb-4">
          <ul className="flex flex-col space-y-4 text-white text-[16px] font-medium">
            <li><a href="/" className="hover:text-blue-200 transition">Home</a></li>
            <li><a href="/about" className="hover:text-blue-200 transition">About</a></li>
            <li><a href="/procedures" className="hover:text-blue-200 transition">Procedures</a></li>
            <li><a href="/testimonials" className="hover:text-blue-200 transition">Testimonials</a></li>
            <li><a href="/blog" className="hover:text-blue-200 transition">Blog</a></li>
            <li><a href="/contact" className="hover:text-blue-200 transition">Contact</a></li>
            <li><a href="/signup" className="hover:text-blue-200 transition">Signup</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;
