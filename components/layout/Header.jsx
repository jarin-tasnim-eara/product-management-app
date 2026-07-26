"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { authService } from "@/services/authService";
import { ROLES } from "@/config/constants";
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, initialized } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const isDashboardArea =
    pathname?.startsWith("/seller") || pathname?.startsWith("/account");


  if (isDashboardArea) {
    return (
      <header className="sticky top-0 z-50 bg-[#1B2430]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            ProductHub
          </Link>
          {user && (
            <span className="text-sm text-white/60">{user.email}</span>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[#1B2430]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
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

        <div className="flex items-center gap-3 shrink-0">
          {!initialized ? (
            <span className="text-sm text-white/50">Loading...</span>
          ) : user ? (
            <>
              {role === ROLES.USER && (
                <Link
                  href="/account/profile"
                  className="text-sm  text-white/70 hover:text-white transition-colors hidden sm:inline"
                >
                 Look at your Dashboard, {user.name || user.email.split("@")[0]}
                </Link>
              )}

              {(role === ROLES.SELLER || role === ROLES.ADMIN) && (
                <Link
                  href="/seller/dashboard"
                  className="text-sm bg-[#6E7A52] text-white px-3 py-1.5 rounded-md hover:bg-[#5a6443] transition-colors"
                >
                  Seller Dashboard
                </Link>
              )}

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

              <button
                onClick={() => authService.logout()}
                className="text-sm bg-[#B5573F] text-white px-3 py-1.5 rounded-md hover:bg-[#9c4a35] transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm bg-white/10 text-white px-3 py-1.5 rounded-md hover:bg-white/20 transition-colors"
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