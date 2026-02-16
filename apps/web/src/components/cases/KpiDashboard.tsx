'use client';

import { useCases } from '@/hooks/useCases';
import { cn } from '@/lib/utils';
import {CaseStatus} from '@repo/database/enums'

export function KpiDashboard() {
  const { data: openData, isLoading: loadingOpen } = useCases({ 
    status: CaseStatus.OPEN, 
    page: 1, 
    limit: 100 
  });
  
  const { data: resolvedData, isLoading: loadingResolved } = useCases({ 
    status: CaseStatus.RESOLVED, 
    page: 1, 
    limit: 100 
  });

  const totalOpen = openData?.meta.total || 0;
  const totalResolved = resolvedData?.meta.total || 0;
  const avgDpd = totalOpen > 0 
    ? (openData?.items.reduce((acc, curr) => acc + curr.dpd, 0) || 0) / openData!.items.length 
    : 0;

  const stats = [
    { label: 'Open Cases', value: totalOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Resolved (Total)', value: totalResolved, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Avg. DPD', value: avgDpd.toFixed(1), color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className={cn("p-6 rounded-xl border shadow-sm bg-white")}>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className={cn("text-3xl font-bold", stat.color)}>
              {loadingOpen || loadingResolved ? '...' : stat.value}
            </h3>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", stat.bg, stat.color)}>
              Live
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}