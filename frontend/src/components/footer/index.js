"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";



const Footer = () => {

  return (
    <>
    

      <footer className="flex justify-center w-full bg-[#00A7B6]">
      <div className="footer w-full pt-24 lg:px-12 px-4 xl:px-0 pb-5 max-w-[1300px]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Column 1: Company Links */}
        <div>
          <h4 className="text-[20px] font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-[16px] leading-[100%]">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/conditions-treated">Conditions treated</Link></li>
            <li><Link href="/non-operative-treatments">Non-operative treatments</Link></li>
            <li><Link href="/spinal-injections">Spinal injections</Link></li>
            <li><Link href="/operative-treatments">Operative treatments</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact us</Link></li>
          </ul>
        </div>

        {/* Column 2: Doctor Info */}
        <div>
          <h4 className="text-[20px] font-semibold mb-2">Dr. Ahamed Shafeek Nanakkal</h4>
          <p className="text-[16px] leading-[100%]">
            MBBS, D-Ortho, DNB Ortho,<br />
            FNB Spine Surgery
          </p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-[#EAEAEA] flex flex-col md:flex-row justify-between items-center text-[14px] text-white/90">
        
        <div className="text-center md:text-left mb-3 md:mb-0">
          © 2025 Dr. Ahamed Shafeek Nanakkal. All rights reserved.
          <span className="ml-2">
            <Link href="/disclaimer" className="underline">[Disclaimer]</Link> |
            <Link href="/privacy-policy" className="underline ml-1">[Privacy Policy]</Link>
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 text-white text-[18px]">
          <a href="#" aria-label="Facebook" className="hover:text-gray-200"><FaFacebookF /></a>
          <a href="#" aria-label="Instagram" className="hover:text-gray-200"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-gray-200"><FaLinkedinIn /></a>
        </div>
      </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
