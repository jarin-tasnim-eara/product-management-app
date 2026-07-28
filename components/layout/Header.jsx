"use client";
import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { authService } from "@/services/authService";
import { ROLES } from "@/config/constants";
import { FaShoppingCart, FaBars } from "react-icons/fa";

export default function Header() {
  const pathname = usePathname();
  const { user, role, initialized } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const isDashboardArea =
    pathname?.startsWith("/seller") ||
    pathname?.startsWith("/account") ||
    pathname?.startsWith("/admin");

 
  function AccountMenu({ dashboardHref, dashboardLabel }) {
    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="text-white/80 hover:text-white p-2 rounded-md hover:bg-white/10 transition-colors"
        >
          <FaBars size={18} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#1B2430]/10 py-1 z-50">
              <p className="px-4 py-2 text-xs text-[#1B2430]/40 truncate border-b border-[#1B2430]/5">
                {user?.email}
              </p>
              <Link
                href={dashboardHref}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-[#1B2430] hover:bg-[#F4F0E4] transition-colors"
              >
                {dashboardLabel}
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  authService.logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-[#B5573F] hover:bg-[#F4F0E4] transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (isDashboardArea) {
    return (
      <header className="sticky top-0 z-50 bg-[#1B2430]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            ProductHub
          </Link>
          <div className="flex items-center gap-4">
            {user && role === ROLES.USER && (
              <Link
                href="/cart"
                className="relative text-white/80 hover:text-white transition-colors p-1.5"
              >
                <FaShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#6E7A52] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {user && (
              <span className="text-sm text-white/60 hidden sm:inline">
                {user.email}
              </span>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[#1B2430]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold text-white shrink-0">
          ProductHub
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {!initialized ? (
            <span className="text-sm text-white/50">Loading...</span>
          ) : user ? (
            role === ROLES.SELLER || role === ROLES.ADMIN ? (
              <AccountMenu
                dashboardHref={role === ROLES.ADMIN ? "/admin/dashboard" : "/seller/dashboard"}
                dashboardLabel={role === ROLES.ADMIN ? "Admin Dashboard" : "Seller Dashboard"}
              />
            ) : (
              <>
                <Link
                  href="/cart"
                  className="relative text-white/80 hover:text-white transition-colors p-1.5"
                >
                  <FaShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#6E7A52] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <AccountMenu dashboardHref="/account/orders" dashboardLabel="My Dashboard" />
              </>
            )
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm bg-[#b276a7] text-white px-3 py-1.5 rounded-md hover:bg-[#9c5f8f] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#6E7A52] text-white rounded-md text-sm hover:bg-[#5a6443] transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}