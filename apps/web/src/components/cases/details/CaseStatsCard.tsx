import { CaseBase } from '@repo/shared';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function CaseStatsCard({ caseData }: { caseData: CaseBase }) {
  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Collection Status</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">DPD</span>
          <span className="text-2xl font-black text-red-400">{caseData.dpd} Days</span>
        </div>
        <div className="flex justify-between items-center border-t border-slate-800 pt-4">
          <span className="text-slate-400 text-sm">Stage</span>
          <StatusBadge type="stage" value={caseData.stage} />
        </div>
        <div className="flex justify-between items-center border-t border-slate-800 pt-4">
          <span className="text-slate-400 text-sm">Status</span>
          <StatusBadge type="status" value={caseData.status} />
        </div>
        <div className="border-t border-slate-800 pt-4">
          <p className="text-slate-400 text-xs uppercase mb-1">Current Assignee</p>
          <p className="font-medium text-blue-300">{caseData.assignedTo || 'Unassigned'}</p>
        </div>
      </div>
    </div>
  );
}