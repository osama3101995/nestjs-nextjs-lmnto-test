import { LoanBase } from '@repo/shared';
import { formatCurrency } from '@/lib/utils';

export function LoanCard({ loan }: { loan: LoanBase }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-slate-800">Financial Details</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-slate-500 uppercase">Principal</p>
          <p className="text-lg font-semibold">{formatCurrency(loan.principal)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">Outstanding</p>
          <p className="text-lg font-bold text-red-600">{formatCurrency(loan.outstanding)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">Due Date</p>
          <p className="text-sm">{new Date(loan.dueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">Loan Status</p>
          <p className="text-sm font-medium italic">{loan.status}</p>
        </div>
      </div>
    </div>
  );
}