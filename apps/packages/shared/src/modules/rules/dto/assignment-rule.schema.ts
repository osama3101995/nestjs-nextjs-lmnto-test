import { z } from 'zod';
import { Operator } from '../types/assignment-rule.types';

export const RuleConditionSchema = z.object({
  field: z.string(),
  operator: z.custom<Operator>(),
  value: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
}).catchall(z.unknown());

export const RuleEffectSchema = z.object({
  stage: z.enum(['SOFT', 'HARD', 'LEGAL']).optional(),
  assignGroup: z.string().optional(),
  assignedTo: z.string().optional(),
}).catchall(z.unknown());

export type RuleCondition = z.infer<typeof RuleConditionSchema>;
export type RuleEffect = z.infer<typeof RuleEffectSchema>;
