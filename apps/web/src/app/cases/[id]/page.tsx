'use client';

import { useParams } from 'next/navigation';
import { useCaseDetails } from '@/hooks/useCases';
import { CustomerCard } from '@/components/cases/details/CustomerCard';
import { LoanCard } from '@/components/cases/details/LoanCard';
import { CaseStatsCard } from '@/components/cases/details/CaseStatsCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { ActionHistory } from '@/components/cases/details/ActionHistory';
import { ActionForm } from '@/components/cases/details/ActionForm';
import { NoticeDownloader } from '@/components/cases/details/NoticeDownloader';
import { AssignmentControl } from '@/components/cases/details/AssignmentControl';

export default function CaseDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: caseData, isLoading, error } = useCaseDetails(id);

  if (isLoading) return <div className="p-8 space-y-6"><Skeleton className="h-40 w-full" /><Skeleton className="h-80 w-full" /></div>;
  if (error || !caseData) return <div className="p-8 text-center text-red-500">Error loading case details.</div>;

  console.log("caseData!!!", caseData)
return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Case Details</h1>
          <p className="text-slate-500">System ID: {caseData.data.id}</p>
        </div>
        <div className="flex gap-3">
           <NoticeDownloader caseId={caseData.data.id} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <CustomerCard customer={caseData.data.customer} />
             <LoanCard loan={caseData.data.loan} />
          </div>
          <ActionHistory actions={caseData.data.actions || []} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <CaseStatsCard caseData={caseData.data} />
          <AssignmentControl caseId={caseData.data.id} />
          <ActionForm caseId={caseData.data.id} />
        </div>
      </div>
    </div>
  );
}