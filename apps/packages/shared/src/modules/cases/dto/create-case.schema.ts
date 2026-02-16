import { CaseStage, CaseStatus } from "@repo/database/enums";
import { z } from 'zod';

export const CreateCaseSchema = z.object({
  customerId: z.number().int(),
  loanId: z.number().int(),
  dpd: z.number().int().min(0),
  stage: z.enum(CaseStage),
  status: z.enum(CaseStatus),
  assignedTo: z.string().min(1).optional(),
});

export type CreateCaseDto = z.infer<typeof CreateCaseSchema>;
