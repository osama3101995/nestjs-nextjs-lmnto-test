import { z } from 'zod';
import { PaginationSchema } from '../../../common/pagination/pagination.schema';

export const ListActionsFieldsSchema = z.object({
  caseId: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
});



export const ListActionsSchema = z.object({
  ...PaginationSchema.shape,
  ...ListActionsFieldsSchema.shape,
});

export type ListActionsDto = z.infer<typeof ListActionsSchema>;

