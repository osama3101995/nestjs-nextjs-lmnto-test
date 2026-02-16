import { z } from 'zod';
import { ActionType, ActionOutcome } from '../enums/action.enums';

export const CreateActionSchema = z.object({
  type: z.enum(ActionType),
  outcome: z.enum(ActionOutcome),
  notes: z.string().optional(),
});

export type CreateActionDto = z.infer<typeof CreateActionSchema>;
