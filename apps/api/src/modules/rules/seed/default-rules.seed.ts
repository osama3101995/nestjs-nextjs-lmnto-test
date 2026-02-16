import { CreateRuleDto } from '@repo/shared';

const defaultRules: CreateRuleDto[] = [
  {
    code: 'DPD_1_7',
    priority: 100,
    conditions: [{ field: 'case.dpd', operator: 'between', min: 1, max: 7 }],
    effects: { stage: 'SOFT', assignGroup: 'Tier1' },
    isOverride: false,
    enabled: true,
  },
  {
    code: 'DPD_8_30',
    priority: 200,
    conditions: [{ field: 'case.dpd', operator: 'between', min: 8, max: 30 }],
    effects: { stage: 'HARD', assignGroup: 'Tier2' },
    isOverride: false,
    enabled: true,
  },
  {
    code: 'DPD_GT_30',
    priority: 300,
    conditions: [{ field: 'case.dpd', operator: 'gt', value: 30 }],
    effects: { stage: 'LEGAL', assignGroup: 'Legal' },
    isOverride: false,
    enabled: true,
  },
  {
    code: 'RISK_OVERRIDE',
    priority: 1000,
    conditions: [{ field: 'customer.riskScore', operator: 'gt', value: 80 }],
    effects: { assignedTo: 'SeniorAgent' },
    isOverride: true,
    enabled: true,
  },
];

export default defaultRules;
