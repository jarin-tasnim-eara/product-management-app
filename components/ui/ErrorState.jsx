export default function ErrorState({message = "Something went wrong.", onRetry}){
  return(
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-red-500 font-medium">{message}</p>
      {onRetry &&(
        <button onClick={onRetry} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">  Try Again </button>
      )}
    </div>
  );
}