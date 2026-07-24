import { FaFilter, FaChevronDown } from "react-icons/fa";

export default function CategoryFilter({ categories, selected, onSelect, totalCount }) {
  return (
    <div className="relative inline-flex items-center">
      <FaFilter className="absolute left-3.5 text-[#6E7A52] text-sm pointer-events-none" />
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none pl-10 pr-9 py-2.5 rounded-full border border-[#1B2430]/15 bg-white text-sm text-[#1B2430] font-medium hover:border-[#6E7A52] focus:outline-none focus:border-[#6E7A52] cursor-pointer capitalize shadow-sm"
      >
        <option value="All">All Categories ({totalCount})</option>
        {categories.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name} ({cat.count})
          </option>
        ))}
      </select>
      <FaChevronDown className="absolute right-3.5 text-[#1B2430]/40 text-xs pointer-events-none" />
    </div>
  );
}