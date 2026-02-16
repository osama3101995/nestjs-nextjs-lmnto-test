interface Props {
  total: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ total, currentPage, limit, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 border-t bg-slate-50/50">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        Page {currentPage} of {totalPages} <span className="mx-2">|</span> Total {total} Records
      </div>
      <div className="flex items-center gap-1">
        <button 
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous Page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="px-4 text-sm font-bold text-slate-700">{currentPage}</div>

        <button 
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next Page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}