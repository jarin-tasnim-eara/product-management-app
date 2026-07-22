export default function ProductDetails({product}){
  const {name,data}=product;
  const entries= data ? Object.entries(data):[];

  return(
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{name}</h1>

      {entries.length >0 ?(
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map(([key, value]) => (
            <div key={key} className="border border-gray-100 rounded-lg p-3 bg-gray-50"
>
              <p className="text-xs text-gray-400  capitalize"> {key}</p>
              <p className="text-sm font-medium text-gray-800 mt-1">{String(value)} </p>
            </div>
          ))}
        </div>
      ):(
        <p className="text-gray-400 italic">No additional details available.</p>
      )}
    </div>
  );
}