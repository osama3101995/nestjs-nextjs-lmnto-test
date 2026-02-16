'use client';

import { useState } from 'react';
import { CaseApi } from '@/services/api.service';
import { useQueryClient } from '@tanstack/react-query';
import { useValidation } from '@/hooks/useValidation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { CreateCaseSchema, CreateCaseDto } from '@repo/shared';
import {CaseStatus, CaseStage} from '@repo/database/enums'

export function CreateCaseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { errors, validate, clearErrors } = useValidation<CreateCaseDto>(CreateCaseSchema);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customerId: '', loanId: '', dpd: 0 });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateCaseDto = { 
      customerId: Number(form.customerId), 
      loanId: Number(form.loanId), 
      dpd: Number(form.dpd),
      stage: CaseStage.SOFT,
      status: CaseStatus.OPEN
    };
    
    if (!validate(payload)) return;

    setLoading(true);
    try {
      await CaseApi.createCase(payload);
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      clearErrors();
      onClose();
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">NEW COLLECTION CASE</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Customer ID</Label>
            <Input 
              type="number" 
              value={form.customerId} 
              onChange={e => setForm({...form, customerId: e.target.value})}
            />
            {errors.customerId && <p className="text-xs text-red-600">{errors.customerId}</p>}
          </div>

          <div className="space-y-2">
            <Label>Loan ID</Label>
            <Input 
              type="number" 
              value={form.loanId} 
              onChange={e => setForm({...form, loanId: e.target.value})}
            />
            {errors.loanId && <p className="text-xs text-red-600">{errors.loanId}</p>}
          </div>

          <div className="space-y-2">
            <Label>Initial DPD</Label>
            <Input 
              type="number" 
              value={form.dpd} 
              onChange={e => setForm({...form, dpd: Number(e.target.value)})}
            />
            {errors.dpd && <p className="text-xs text-red-600">{errors.dpd}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>CANCEL</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'CREATING...' : 'CONFIRM CASE'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}