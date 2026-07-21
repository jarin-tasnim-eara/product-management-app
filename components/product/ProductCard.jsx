import Link from "next/link";

export default function ProductCard({product }) {
  const {id,name,data}= product;
  const price= data?.price;
  const category= data?.category;

   const entries= data? Object.entries(data):[];

  return(
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition flex flex-col">
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-2"> {name}</h3>

        {entries.length > 0 ? (
          <ul className="text-sm text-gray-500 space-y-1">
            {entries.slice(0, 2).map(([key, value]) => (
              <li key={key}>
                <span className="capitalize">{key}</span>: {String(value)}
              </li>
            ))}
          </ul>
        ):(
          <p className="text-sm text-gray-400 italic">No details available</p>
        )}
      </div>

      <Link href={`/products/${id}`}className="mt-4 text-center px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-700 transition"> View Details</Link>
    </div>
  );
}