'use client';

import { useState } from 'react';
import { CaseApi } from '@/services/api.service';
import { cn } from '@/lib/utils';

export function NoticeDownloader({ caseId }: { caseId: number }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleDownload = async () => {
    setStatus('loading');
    try {
      await CaseApi.getPdfNotice(caseId);
      setStatus('idle');
    } catch (err) {
      console.error('Download failed:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleDownload}
        disabled={status === 'loading'}
        className={cn(
          "w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all border-2",
          status === 'idle' && "bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 shadow-sm",
          status === 'loading' && "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed",
          status === 'error' && "bg-red-50 border-red-200 text-red-600"
        )}
      >
        <svg 
          className={cn("w-5 h-5", status === 'loading' && "animate-bounce")} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        {status === 'loading' ? 'GENERATING PDF...' : status === 'error' ? 'FAILED TO GENERATE' : 'DOWNLOAD LEGAL NOTICE'}
      </button>
      
      {status === 'error' && (
        <p className="text-[10px] text-red-500 mt-2 text-center font-medium uppercase tracking-tighter">
          Check backend Puppeteer configuration
        </p>
      )}
    </div>
  );
}