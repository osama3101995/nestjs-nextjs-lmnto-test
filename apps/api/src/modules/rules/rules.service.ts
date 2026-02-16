import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { CreateRuleDto, ListRulesDto } from '@repo/shared';
import {
  CreateRuleResponse,
  ListRulesResponse,
  AssignmentRuleBase,
} from '@repo/shared';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RulesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRule(
    dto: CreateRuleDto,
  ): Promise<AssignmentRuleBase> {
    const created = await this.prisma.assignmentRule.create({
      data: {
        code: dto.code,
        priority: dto.priority,
        conditions: dto.conditions as Prisma.InputJsonValue,
        effects: dto.effects as Prisma.InputJsonValue,
        isOverride: dto.isOverride ?? false,
        enabled: dto.enabled ?? true,
      },
    });

    const response = new AssignmentRuleBase();
    response.id = created.id;
    response.code = created.code;
    response.priority = created.priority;
    response.conditions = created.conditions;
    response.effects = created.effects;
    response.isOverride = created.isOverride;
    response.enabled = created.enabled;
    response.createdAt = created.createdAt;
    response.updatedAt = created.updatedAt;

    return response;
  }

  async listRules(
    enabled?: boolean,
  ): Promise<ListRulesResponse> {
    const rules = await this.prisma.assignmentRule.findMany({
      where: enabled === undefined ? {} : { enabled },
      orderBy: { priority: 'asc' },
    });
    const items: AssignmentRuleBase[] = rules.map((r) => {
      const rule = new AssignmentRuleBase();
      rule.id = r.id;
      rule.code = r.code;
      rule.priority = r.priority;
      rule.conditions = r.conditions;
      rule.effects = r.effects;
      rule.isOverride = r.isOverride;
      rule.enabled = r.enabled;
      rule.createdAt = r.createdAt;
      rule.updatedAt = r.updatedAt;
      return rule;
    });

    const response = new ListRulesResponse();
    response.items = items;

    return response;
  }

    async seedDefaultRules() {
    const rules = await import('./seed/default-rules.seed');
    for (const rule of rules.default) {
      const exists = await this.prisma.assignmentRule.findUnique({
        where: { code: rule.code },
      });
      if (!exists) {
        await this.createRule(rule);
      }
    }
  }
}
