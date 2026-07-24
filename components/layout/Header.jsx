"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { authService } from "@/services/authService";
import { ROLES } from "@/config/constants";
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  const router = useRouter();
  const { user, role, initialized } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-50 bg-[#1B2430]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="text-xl font-bold text-white shrink-0">
          ProductHub
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          {!initialized ? (
            <span className="text-sm text-white/50">Loading...</span>
          ) : user ? (
            <>
              <span className="text-sm text-white/70 capitalize hidden sm:inline">
                {user.email} ({role})
              </span>

              {role === ROLES.SELLER && (
                <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full font-medium">
                  My Products
                </span>
              )}

              {(role === ROLES.SELLER || role === ROLES.ADMIN) && (
                <button
                  onClick={() => router.push("/products/create")}
                  className="text-sm bg-[#6E7A52] text-white px-3 py-1.5 rounded-md hover:bg-[#5a6443] transition-colors"
                >
                  + Add
                </button>
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
                className="text-sm bg-[#b276a7] text-white px-3 py-1.5 rounded-md hover:bg-white/20 transition-colors"
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