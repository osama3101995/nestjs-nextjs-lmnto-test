'use client';

import { useState } from 'react';
import { useCaseActions } from '@/hooks/useCases';
import { useValidation } from '@/hooks/useValidation';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { CreateActionSchema, ActionType, ActionOutcome, CreateActionDto } from '@repo/shared';

export function ActionForm({ caseId }: { caseId: number }) {
  const [form, setForm] = useState<CreateActionDto>({ 
    type: ActionType.CALL, 
    outcome: ActionOutcome.NO_ANSWER, 
    notes: '' 
  });
  
  const { mutate, isPending } = useCaseActions(caseId);
  const { errors, validate, clearErrors } = useValidation<CreateActionDto>(CreateActionSchema);

  const types = Object.values(ActionType);
  const outcomes = Object.values(ActionOutcome);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    mutate(form, {
      onSuccess: () => {
        setForm({ type: ActionType.CALL, outcome: ActionOutcome.NO_ANSWER, notes: '' });
        clearErrors();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <h3 className="font-bold text-slate-800 text-sm">LOG INTERACTION</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select 
            value={form.type} 
            onValueChange={(value) => setForm({ ...form, type: value as ActionType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-[10px] text-red-500">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label>Outcome</Label>
          <Select 
            value={form.outcome} 
            onValueChange={(value) => setForm({ ...form, outcome: value as ActionOutcome })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Outcome" />
            </SelectTrigger>
            <SelectContent>
              {outcomes.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.outcome && <p className="text-[10px] text-red-500">{errors.outcome}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-500 uppercase">Notes</Label>
        <textarea 
          className="w-full p-2 border rounded-lg text-sm min-h-[80px] focus:ring-2 focus:ring-slate-900 outline-none"
          value={form.notes}
          onChange={e => setForm({...form, notes: e.target.value})}
        />
        {errors.notes && <p className="text-[10px] text-red-500">{errors.notes}</p>}
      </div>

      <Button type="submit" disabled={isPending} className="w-full" variant="secondary">
        {isPending ? 'SAVING...' : 'SAVE ACTION'}
      </Button>
    </form>
  );
}