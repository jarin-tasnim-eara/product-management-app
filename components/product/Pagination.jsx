export default function Pagination({ currentPage, totalPages, onPageChange}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button disabled={currentPage === 1} onClick={()=> onPageChange(currentPage - 1)}
       className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50">
        Prev
      </button>

      <span className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>

      <button disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50" >
        Next
      </button>
    </div>
  );
}