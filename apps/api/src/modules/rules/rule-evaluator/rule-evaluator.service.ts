import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RuleEvaluatorService {
  constructor(private readonly prisma: PrismaService) {}

  async evaluate(caseData: any, customerData: any, loanData: any) {
    const rules = await this.prisma.assignmentRule.findMany({
      where: { enabled: true },
      orderBy: { priority: 'asc' },
    });

    const context = {
      case: caseData,
      customer: customerData,
      loan: loanData,
    };

    const normalRules: any[] = [];
    const overrideRules: any[] = [];

    for (const rule of rules) {
      if (rule.isOverride) overrideRules.push(rule);
      else normalRules.push(rule);
    }

    normalRules.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    overrideRules.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

    const matchedRules: any[] = [];
    let finalEffects: any = {};

    for (const rule of normalRules) {
      if (this.matchRule(rule, context)) {
        matchedRules.push(rule);
        finalEffects = { ...finalEffects, ...(rule.effects || {}) };
      }
    }

    for (const rule of overrideRules) {
      if (this.matchRule(rule, context)) {
        matchedRules.push(rule);
        finalEffects = { ...finalEffects, ...(rule.effects || {}) };
      }
    }

    return { finalEffects, matchedRules };
  }

  private matchRule(rule: any, context: any): boolean {
    const conditions: any[] = rule.conditions || [];
    for (const cond of conditions) {
      const { field, operator, value, min, max } = cond;
      const fieldValueRaw = this.getFieldValue(field, context);
      const fieldValue = this.normalizeValue(fieldValueRaw);
      const condValue = this.normalizeValue(value);
      const condMin = this.normalizeValue(min);
      const condMax = this.normalizeValue(max);

      if (operator === 'eq' && fieldValue !== condValue) return false;
      if (operator === 'gt' && !(fieldValue > condValue)) return false;
      if (operator === 'lt' && !(fieldValue < condValue)) return false;
      if (operator === 'between' && (fieldValue < condMin || fieldValue > condMax))
        return false;
    }
    return true;
  }

  private getFieldValue(field: string, context: any) {
    if (!field) return undefined;
    const parts = field.split('.');
    if (parts.length === 1) {
      const key = parts[0];
      if (context.case && Object.prototype.hasOwnProperty.call(context.case, key)) return context.case[key];
      if (context.customer && Object.prototype.hasOwnProperty.call(context.customer, key)) return context.customer[key];
      if (context.loan && Object.prototype.hasOwnProperty.call(context.loan, key)) return context.loan[key];
      return context[key];
    }
    let value: any = context;
    for (const p of parts) {
      if (value === undefined || value === null) return undefined;
      value = value[p];
    }
    return value;
  }

  private normalizeValue(v: any): any {
    if (v === undefined || v === null) return v;
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v !== '' && !isNaN(Number(v))) return Number(v);
    if (typeof v === 'object') {
      if (typeof v.toNumber === 'function') {
        try {
          return v.toNumber();
        } catch {
          return Number(v.toString());
        }
      }
      if (typeof v.valueOf === 'function') {
        const val = v.valueOf();
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
      }
    }
    return v;
  }
}
