"use client";
import Link from "next/link";
import {FaSearch} from "react-icons/fa";
import { useSelector } from "react-redux";
import { authService } from "@/services/authService";

export default function Header(){
    const { user, role ,initialized} = useSelector((state) => state.auth);

  return(
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

        <Link href="/" className="text-xl font-bold text-gray-900 shrink-0"> ProductHub</Link>

        <div className="hidden md:flex flex-1 max-w-md items-center border border-gray-300 rounded-md px-3 py-2">
          <FaSearch className="text-gray-400 text-sm" />
          <input type="text" placeholder="Search products..." className="ml-2 w-full outline-none text-sm"/>
        </div>

        <div className="flex items-center gap-4 shrink-0">
             {user ? (
            <>
              <span className="text-sm text-gray-600 capitalize"> {user.email} ({role}) </span>
              <button onClick={() => authService.logout()}className="text-sm text-gray-600 hover:text-gray-900" > Logout </button>
            </>
          ):(
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
              <Link href="/signup" className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-700">  Sign Up </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}