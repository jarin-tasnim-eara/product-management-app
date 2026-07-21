import Link from "next/link";
import {FaSearch, FaUserCircle} from "react-icons/fa";

export default function Header(){
  return(
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

        <Link href="/" className="text-xl font-bold text-gray-900 shrink-0"> ProductHub</Link>

        <div className="hidden md:flex flex-1 max-w-md items-center border border-gray-300 rounded-md px-3 py-2">
          <FaSearch className="text-gray-400 text-sm" />
          <input type="text" placeholder="Search products..." className="ml-2 w-full outline-none text-sm"/>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
          <Link href="/signup" className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-700"> Sign Up</Link>
        </div>
      </div>
    </header>
  );
}