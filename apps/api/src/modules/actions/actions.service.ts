import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionLogBase } from '@repo/shared';

@Injectable()
export class ActionsService {
  constructor(private readonly prisma: PrismaService) {}

  async addAction(caseId: number, dto: any): Promise<ActionLogBase> {
    return this.prisma.$transaction(async (tx) => {
      const caseExists = await tx.case.findUnique({
        where: { id: caseId },
        select: { id: true },
      });

      if (!caseExists) throw new NotFoundException('Case not found');

      const created = await tx.actionLog.create({
        data: {
          caseId,
          type: dto.type,
          outcome: dto.outcome,
          notes: dto.notes,
        },
      });

      return {
        id: created.id,
        caseId: created.caseId,
        type: created.type,
        outcome: created.outcome,
        notes: created.notes,
        createdAt: created.createdAt,
      };
    });
  }

  async getLastActions(caseId: number, limit = 10): Promise<ActionLogBase[]> {
    const caseExists = await this.prisma.case.findUnique({
      where: { id: caseId },
      select: { id: true },
    });
    if (!caseExists) throw new NotFoundException('Case not found');

    const actions = await this.prisma.actionLog.findMany({
      where: { caseId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return actions.map((a) => ({
      id: a.id,
      caseId: a.caseId,
      type: a.type,
      outcome: a.outcome,
      notes: a.notes,
      createdAt: a.createdAt,
    }));
  }
}
