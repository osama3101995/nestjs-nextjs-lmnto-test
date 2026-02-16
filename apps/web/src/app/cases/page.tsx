'use client';

import { useState, useMemo } from 'react';
import { useCases } from '@/hooks/useCases';
import { ListCasesDto } from '@repo/shared';
import { CaseTable } from '@/components/cases/CaseTable';
import { CaseFilters } from '@/components/cases/CaseFilters';
import { KpiDashboard } from '@/components/cases/KpiDashboard';
import { Pagination } from '@/components/ui/Pagination';
import { CreateCaseModal } from '@/components/cases/CreateCaseModal';

export default function CasesPage() {
  const [filters, setFilters] = useState<ListCasesDto>({
    page: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading } = useCases(filters);

  const caseItems = useMemo(() => data?.items || [], [data]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Collections Overview</h1>
          <p className="text-slate-500">Monitor active cases and agent performance.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-md"
        >
          + NEW CASE
        </button>
      </header>

      <KpiDashboard />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Active Pipeline</h2>
          <CaseFilters 
            values={filters} 
            onChange={(val) => setFilters((prev) => ({ ...prev, ...val, page: 1 }))} 
          />
        </div>

        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
          <CaseTable 
            data={caseItems} 
            isLoading={isLoading}
          />
          <Pagination 
            total={data?.meta.total || 0}
            currentPage={filters.page || 1} 
            limit={filters.limit || 10}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </div>
      </section>

      <CreateCaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}