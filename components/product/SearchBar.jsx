import {FaSearch} from "react-icons/fa";

export default function SearchBar({value,onChange }){
  return(
    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full sm:w-72">
      <FaSearch className="text-gray-400 text-sm" />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search products..." className="ml-2 w-full outline-none text-sm" />
    </div>
  );
}