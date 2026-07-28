"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartBar,
  FaBoxOpen,
  FaUsers,
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { authService } from "@/services/authService";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FaChartBar },
  { href: "/admin/products", label: "All Products", icon: FaBoxOpen },
  { href: "/admin/users", label: "Users", icon: FaUsers },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-[82px] left-4 z-40 bg-[#1B2430] text-white p-2.5 rounded-md shadow-lg"
      >
        <FaBars size={16} />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-60 shrink-0 bg-[#1B2430] text-white/70 flex flex-col py-6 z-50 transform transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 mb-8">
          <p className="text-xs text-white/40 uppercase tracking-wide">Admin Panel</p>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-white/60 hover:text-white"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active ? "bg-[#6E7A52] text-white" : "hover:bg-white/10"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mt-4 border-t border-white/10 pt-4 flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm hover:bg-white/10 transition-colors"
          >
            <FaHome size={15} />
            Back to Home
          </Link>
          <button
            onClick={() => authService.logout()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left hover:bg-white/10 text-[#e8a89b] transition-colors"
          >
            <FaSignOutAlt size={15} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}