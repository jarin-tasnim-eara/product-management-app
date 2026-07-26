"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { authService } from "@/services/authService";

const LINKS = [
  { href: "/account/orders", label: "My Orders", icon: FaShoppingBag },
  { href: "/cart", label: "Cart", icon: FaShoppingCart },
  { href: "/account/profile", label: "Profile", icon: FaUser },
  { href: "/account/settings", label: "Settings", icon: FaCog },
];

export default function BuyerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-[#1B2430] text-white/70 flex flex-col py-6">
      <div className="px-6 mb-8">
        <p className="text-white font-bold text-lg">ProductHub</p>
        <p className="text-xs text-white/40">My Account</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
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
  );
}