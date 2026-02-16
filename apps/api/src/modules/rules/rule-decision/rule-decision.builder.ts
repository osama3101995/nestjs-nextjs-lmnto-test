import { Injectable } from '@nestjs/common';

@Injectable()
export class RuleDecisionBuilder {
  build(matchedRules: any[], context: any) {
    const explanationLines: string[] = [];
    const ruleSummaries: string[] = [];

    matchedRules.forEach((rule) => {
      const conds = (rule.conditions || []).map((c) => {
        const fieldValue = this.getFieldValue(c.field, context);
        let condDesc = '';
        switch (c.operator) {
          case 'eq':
            condDesc = `${c.field}=${fieldValue} === ${c.value}`;
            break;
          case 'gt':
            condDesc = `${c.field}=${fieldValue} > ${c.value}`;
            break;
          case 'lt':
            condDesc = `${c.field}=${fieldValue} < ${c.value}`;
            break;
          case 'between':
            condDesc = `${c.field}=${fieldValue} between ${c.min} and ${c.max}`;
            break;
          default:
            condDesc = `${c.field} ${c.operator} ${c.value ?? ''}`;
        }
        return condDesc;
      });

      const effects = Object.entries(rule.effects || {})
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');

      const overrideNote = rule.isOverride ? '[OVERRIDE]' : '';

      explanationLines.push(
        `${overrideNote}${rule.code} matched: ${conds.join('; ')} => Effects: ${effects}`
      );

      ruleSummaries.push(rule.code);
    });

    const reason = explanationLines.join('\n');

    return {
      matchedRules: ruleSummaries,
      reason,
    };
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
}
