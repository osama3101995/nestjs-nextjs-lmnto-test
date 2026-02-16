import { ActionLogBase } from '@repo/shared';

export function ActionHistory({ actions }: { actions: ActionLogBase[] }) {
  if (actions.length === 0) return <p className="text-slate-400 text-sm">No actions recorded yet.</p>;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800">Activity Timeline</h3>
      <div className="relative border-l-2 border-slate-100 ml-2 pl-6 space-y-6">
        {actions.map((action) => (
          <div key={action.id} className="relative">
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-bold text-slate-900">{action.type}</span>
                <span className="mx-2 text-slate-300">•</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                  {action.outcome}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(action.createdAt).toLocaleString()}
              </span>
            </div>
            {action.notes && (
              <p className="mt-1 text-sm text-slate-600 bg-slate-50 p-2 rounded italic">
                "{action.notes}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}