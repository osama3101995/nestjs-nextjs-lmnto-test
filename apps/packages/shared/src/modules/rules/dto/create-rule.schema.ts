import { z } from 'zod';
import { RuleConditionSchema, RuleEffectSchema } from './assignment-rule.schema';


export const CreateRuleSchema = z.object({
  code: z.string().min(1),
  priority: z.number().int(),
  conditions: z.array(RuleConditionSchema),
  effects: RuleEffectSchema,
  isOverride: z.boolean().optional().default(false),
  enabled: z.boolean().optional().default(true),
});

export type CreateRuleDto = z.infer<typeof CreateRuleSchema>;
