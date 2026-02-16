import { CustomerBase } from '@repo/shared';

export function CustomerCard({ customer }: { customer: CustomerBase }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-slate-800">Customer Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 uppercase">Full Name</p>
          <p className="font-medium">{customer.name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">Risk Score</p>
          <p className={`font-bold ${customer.riskScore > 70 ? 'text-red-600' : 'text-green-600'}`}>
            {customer.riskScore}/100
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">Email</p>
          <p className="text-sm">{customer.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">Phone</p>
          <p className="text-sm">{customer.phone}</p>
        </div>
      </div>
    </div>
  );
}