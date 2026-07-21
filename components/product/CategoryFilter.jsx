export default function CategoryFilter({categories,selected,onSelect }){
  return(
    <div className="flex flex-wrap gap-2">
      <button
        onClick={()=> onSelect("All")} className={`px-3 py-1.5 rounded-full text-sm border transition ${
          selected === "All" ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-600 hover:border-gray-400"
        }`}> All </button>

      {categories.map((cat) => (
        <button key={cat} onClick={() => onSelect(cat)} className={`px-3 py-1.5 rounded-full text-sm border capitalize transition ${
            selected === cat? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-600 hover:border-gray-400"
          }`} > {cat} </button>
      ))}
    </div>
  );
}