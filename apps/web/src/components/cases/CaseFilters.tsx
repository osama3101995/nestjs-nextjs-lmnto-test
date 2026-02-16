'use client';

import { ListCasesDto } from '@repo/shared';
import {CaseStatus, CaseStage} from '@repo/database/enums'

interface Props {
  values: ListCasesDto;
  onChange: (val: Partial<ListCasesDto>) => void;
}

export function CaseFilters({ values, onChange }: Props) {
  const statuses = Object.values(CaseStatus as Record<string, string>);
  const stages = Object.values(CaseStage as Record<string, string>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-100 rounded-lg">
      <select 
        className="p-2 border rounded bg-white text-sm"
        value={values.status || ''}
        onChange={(e) => onChange({ status: (e.target.value as CaseStatus) || undefined })}
      >
        <option value="">All Statuses</option>
        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select 
        className="p-2 border rounded bg-white text-sm"
        value={values.stage || ''}
        onChange={(e) => onChange({ stage: (e.target.value as CaseStage) || undefined })}
      >
        <option value="">All Stages</option>
        {stages.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <input 
        type="number" 
        placeholder="Min DPD"
        className="p-2 border rounded bg-white text-sm"
        value={values.dpdMin || ''}
        onChange={(e) => onChange({ dpdMin: e.target.value ? Number(e.target.value) : undefined })}
      />

      <input 
        type="text" 
        placeholder="Search Agent..."
        className="p-2 border rounded bg-white text-sm"
        value={values.assignedTo || ''}
        onChange={(e) => onChange({ assignedTo: e.target.value || undefined })}
      />
    </div>
  );
}