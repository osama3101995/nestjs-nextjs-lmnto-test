import { ListCasesItem } from '@repo/shared';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';

interface Props {
  data: ListCasesItem[];
  isLoading: boolean;
}

export function CaseTable({ data, isLoading= true }: Props) {

  
  if (isLoading) {
    return <TableSkeleton />;
  }


  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900">No cases found</h3>
        <p className="text-slate-500">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b text-sm font-medium text-slate-600">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Outstanding</th>
            <th className="p-4">DPD</th>
            <th className="p-4">Stage</th>
            <th className="p-4">Status</th>
            <th className="p-4">Assigned To</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
              <td className="p-4 font-mono text-xs text-slate-500">#{item.id}</td>
              <td className="p-4 font-medium text-slate-900">{item.customerName}</td>
              <td className="p-4 font-semibold">{formatCurrency(item.outstanding)}</td>
              <td className="p-4">
                <span className={item.dpd > 30 ? "text-red-600 font-bold" : "text-slate-700"}>
                  {item.dpd}
                </span>
              </td>
              <td className="p-4"><StatusBadge type="stage" value={item.stage} /></td>
              <td className="p-4"><StatusBadge type="status" value={item.status} /></td>
              <td className="p-4 text-slate-600 text-sm">{item.assignedTo || '--'}</td>
              <td className="p-4 text-right">
                <Link 
                  href={`/cases/${item.id}`} 
                  className="inline-flex items-center px-3 py-1 bg-slate-900 text-white! text-xs rounded hover:bg-slate-700 transition-colors"
                >
                  Check Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}