"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16 text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-3">Real Estate</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/properties">Browse Property</Link>
              </li>
              <li>
                <Link href="/favorites">Saved Property</Link>
              </li>
              <li>
                <Link href="/sell">Sell Your Property</Link>
              </li>
              <li>
                <Link href="/rent">Rental Listings</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/news">Newsroom</Link>
              </li>
              <li>
                <Link href="/investors">Investors</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help-center">Help Center</Link>
              </li>
              <li>
                <Link href="/contact">Contact Support</Link>
              </li>
              <li>
                <Link href="/report">Report a Listing</Link>
              </li>
              <li>
                <Link href="/faq">FAQs</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">Terms of Use</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/cookies">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/disclaimer">Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2025 Zillow Realty. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy-policy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/sitemap" className="hover:underline">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
