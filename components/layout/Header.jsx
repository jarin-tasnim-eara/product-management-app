"use client";
import Link from "next/link";
import {FaSearch} from "react-icons/fa";
import { useSelector } from "react-redux";
import { authService } from "@/services/authService";
import { ROLES } from "@/config/constants";
import { useRouter } from "next/navigation";
export default function Header(){
   const router = useRouter();
    const { user, role ,initialized} = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="text-xl font-bold text-gray-900 shrink-0">
          ProductHub
        </Link>


        <div className="flex items-center gap-4 shrink-0">
          {!initialized ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : user ? (
            <>
              <span className="text-sm text-gray-600 capitalize">
                {user.email} ({role})
              </span>

              
              {role === ROLES.SELLER && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  My Products
                </span>
              )}

             
              {(role === ROLES.SELLER || role === ROLES.ADMIN) && (
                <button
                  onClick={() => router.push("/products/create")}
                  className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-700"
                >
                  + Add
                </button>
              )}

              <button
                onClick={() => authService.logout()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-700"
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