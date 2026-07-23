import Link from "next/link";
import { FaStar } from "react-icons/fa";

export default function ProductCard({ product }) {
  const { id, name, data } = product;
  const price = data?.price;
  const category = data?.category;
  const brand = data?.brand;
  const rating = data?.rating;
  const image = data?.image;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition flex flex-col">
      <div className="w-full aspect-square mb-3 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-300 text-sm">No image</span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-1">
          {name}
        </h3>

        {(brand || category) && (
          <p className="text-xs text-gray-400 capitalize mb-2">
            {[brand, category].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          {price != null && (
            <span className="text-sm font-semibold text-gray-800">
              ${price}
            </span>
          )}
          {rating != null && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FaStar className="text-yellow-400" />
              {Number(rating).toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/products/${id}`}
        className="mt-4 text-center px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-700 transition"
      >
        View Details
      </Link>
    </div>
  );
}