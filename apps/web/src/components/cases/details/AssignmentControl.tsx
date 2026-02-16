'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CaseApi } from '@/services/api.service';
import { AssignmentResult } from '@repo/shared';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function AssignmentControl({ caseId }: { caseId: number }) {
  const [result, setResult] = useState<AssignmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleRun = async () => {
    setLoading(true);
    try {
      const data = await CaseApi.runAssignment(caseId);
      setResult(data);
      // Invalidate current case to refresh Stage and Assignee in CaseStatsCard
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-sm uppercase">Rule Engine</h3>
        <button
          onClick={handleRun}
          disabled={loading}
          className="px-4 py-2 bg-slate-900 text-white text-xs rounded-md hover:bg-slate-800 disabled:opacity-50 transition-all font-bold"
        >
          {loading ? 'Processing...' : 'RUN ASSIGNMENT'}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex gap-4 mb-3">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">New Stage</p>
              <StatusBadge type="stage" value={result.data.stage} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Assignee</p>
              <p className="text-sm font-medium">{result.data.assignedTo}</p>
            </div>
          </div>
          
          <div className="border-t pt-2">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Logic Applied</p>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              {result.data.decision.reason || "No specific rule matched; defaulted to standard flow."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}