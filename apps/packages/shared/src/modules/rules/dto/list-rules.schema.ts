import { z } from 'zod';

export const ListRulesSchema = z.object({
  enabled: z.coerce.boolean().optional(),
});

export type ListRulesDto = z.infer<typeof ListRulesSchema>;
