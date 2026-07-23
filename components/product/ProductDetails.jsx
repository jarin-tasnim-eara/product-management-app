import { FaStar } from "react-icons/fa";

export default function ProductDetails({ product }) {
  const { name, data } = product;
  const { image, price, brand, category, rating, description, ...rest } =
    data || {};

  const otherEntries = Object.entries(rest).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-300 text-sm">No image</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{name}</h1>

          {(brand || category) && (
            <p className="text-sm text-gray-400 capitalize mb-3">
              {[brand, category].filter(Boolean).join(" · ")}
            </p>
          )}

          <div className="flex items-center gap-4 mb-4">
            {price != null && (
              <span className="text-xl font-semibold text-gray-900">
                ${price}
              </span>
            )}
            {rating != null && (
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <FaStar className="text-yellow-400" />
                {Number(rating).toFixed(1)}
              </span>
            )}
          </div>

          {description && (
            <p className="text-sm text-gray-600 mb-4">{description}</p>
          )}

          {otherEntries.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {otherEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                >
                  <p className="text-xs text-gray-400 capitalize">{key}</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}