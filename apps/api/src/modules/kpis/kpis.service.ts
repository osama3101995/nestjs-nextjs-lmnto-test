import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CaseCountByStatusResponse,
  CaseCountByStatusItem,
  ActiveCaseByAssigneeResponse,
  ActiveCaseByAssigneeItem,
} from '@repo/shared';

@Injectable()
export class KpisService {
  constructor(private readonly prisma: PrismaService) {}

  async getCaseCountByStatus(): Promise<CaseCountByStatusResponse> {
    const raw = await this.prisma.case.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const items = raw.map((r) => {
      const item = new CaseCountByStatusItem();
      item.status = r.status;
      item.count = r._count.status;
      return item;
    });

    const response = new CaseCountByStatusResponse();
    response.items = items;

    return response;
  }

  async getActiveCaseCountByAssignee(): Promise<ActiveCaseByAssigneeResponse> {
    const raw = await this.prisma.case.groupBy({
      by: ['assignedTo'],
      where: { status: { not: 'CLOSED' } }, 
      _count: { assignedTo: true },
    });

    const items = raw.map((r) => {
      const item = new ActiveCaseByAssigneeItem();
      item.assignedTo = r.assignedTo;
      item.count = r._count.assignedTo;
      return item;
    });

    const response = new ActiveCaseByAssigneeResponse();
    response.items = items;

    return response;
  }
}
