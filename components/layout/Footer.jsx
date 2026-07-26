"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/seller") || pathname?.startsWith("/account")) {
    return null;
  }

  return (
    <footer className="bg-[#1B2430] text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <p className="text-white text-lg font-bold mb-2">ProductHub</p>
          <p className="text-sm text-white/50">
            Everything you need, in one aisle.
          </p>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-3">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-3">Follow Us</p>
          <div className="flex gap-3">
            <a href="#" className="hover:text-white transition-colors">
              <FaFacebook size={18} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} ProductHub. All rights reserved.
      </div>
    </footer>
  );
}