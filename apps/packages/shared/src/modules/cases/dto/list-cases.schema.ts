import { z } from 'zod';
import { PaginationSchema } from '../../../common/pagination/pagination.schema';
import { CaseStage, CaseStatus } from "@repo/database/enums";

export const ListCasesFieldsSchema = z.object({
  status: z.enum(CaseStatus).optional(),
  stage: z.enum(CaseStage).optional(),
  dpdMin: z.coerce.number().int().min(0).optional(),
  dpdMax: z.coerce.number().int().min(0).optional(),
  assignedTo: z.string().optional(),
});

export const ListCasesSchema = z.object({
  ...PaginationSchema.shape,
  ...ListCasesFieldsSchema.shape,
});

export type ListCasesDto = z.infer<typeof ListCasesSchema>;
