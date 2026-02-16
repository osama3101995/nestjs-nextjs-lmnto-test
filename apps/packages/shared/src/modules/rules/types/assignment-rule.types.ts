import { RuleCondition, RuleEffect } from "../dto/assignment-rule.schema";

export type Operator = 'eq' | 'gt' | 'lt' | 'between';

export class AssignmentRule {
  code!: string;
  priority!: number;
  conditions!: RuleCondition[];
  effects!: RuleEffect;
  isOverride?: boolean;
  enabled?: boolean;
}