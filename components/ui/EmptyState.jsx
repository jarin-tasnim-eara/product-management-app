export default function EmptyState({message= "No products found."}){
  return(
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
}