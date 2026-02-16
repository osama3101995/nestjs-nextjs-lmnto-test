import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginationDto,
  CustomerBase,
  LoanBase,
  ActionLogBase,
  RuleDecisionBase,
  RuleDecisionSnapshotBase,
  CaseBase,
} from '@repo/shared';

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCase(dto: any): Promise<CaseBase & { customer: CustomerBase; loan: LoanBase }> {
    const created = await this.prisma.case.create({
      data: {
        customerId: dto.customerId,
        loanId: dto.loanId,
        dpd: dto.dpd,
        stage: dto.stage,
        status: dto.status,
        assignedTo: dto.assignedTo ?? null,
      },
      include: { customer: true, loan: true },
    });

    return this.mapCreateCaseResponse(created);
  }

  async listCases(
    filters: any,
    pagination: PaginationDto,
  ) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.stage) where.stage = filters.stage;
    if (filters.assignedTo) where.assignedTo = filters.assignedTo;
    if (filters.dpdMin !== undefined || filters.dpdMax !== undefined) {
      where.dpd = {};
      if (filters.dpdMin !== undefined) where.dpd.gte = filters.dpdMin;
      if (filters.dpdMax !== undefined) where.dpd.lte = filters.dpdMax;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.case.findMany({
        where,
        include: { customer: true, loan: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.case.count({ where }),
    ]);

    return {
      success: true,
      items: items.map(this.mapListCasesItem),
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async getCaseById(id: number) {
    const caseData = await this.prisma.case.findUnique({
      where: { id },
      include: {
        customer: true,
        loan: true,
        actions: { orderBy: { createdAt: 'desc' } },
        decisions: { include: { snapshots: true }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!caseData) throw new NotFoundException('Case not found');

    return this.mapCaseDetails(caseData);
  }

  private mapCustomer = (customer: any): CustomerBase => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    country: customer.country,
    riskScore: customer.riskScore,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
  });

  private mapLoan = (loan: any): LoanBase => ({
    id: loan.id,
    customerId: loan.customerId,
    principal: loan.principal.toString(),
    outstanding: loan.outstanding.toString(),
    dueDate: loan.dueDate,
    status: loan.status,
    createdAt: loan.createdAt,
    updatedAt: loan.updatedAt,
  });

  private mapCreateCaseResponse = (c: any) => ({
    id: c.id,
    customerId: c.customerId,
    loanId: c.loanId,
    dpd: c.dpd,
    stage: c.stage,
    status: c.status,
    assignedTo: c.assignedTo,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    customer: this.mapCustomer(c.customer),
    loan: this.mapLoan(c.loan),
  });

  private mapListCasesItem = (c: any) => ({
    id: c.id,
    dpd: c.dpd,
    stage: c.stage,
    status: c.status,
    assignedTo: c.assignedTo,
    customerName: c.customer.name,
    outstanding: c.loan.outstanding.toString(),
    createdAt: c.createdAt,
  });

  private mapAction = (a: any): ActionLogBase => ({
    id: a.id,
    caseId: a.caseId,
    type: a.type,
    outcome: a.outcome,
    notes: a.notes,
    createdAt: a.createdAt,
  });

  private mapDecisionSnapshot = (s: any): RuleDecisionSnapshotBase => ({
    id: s.id,
    ruleDecisionId: s.ruleDecisionId,
    assignedTo: s.assignedTo,
    stage: s.stage,
    createdAt: s.createdAt,
  });

  private mapDecision = (d: any): RuleDecisionBase => ({
    id: d.id,
    caseId: d.caseId,
    matchedRules: d.matchedRules,
    reason: d.reason,
    createdAt: d.createdAt,
    snapshots: d.snapshots.map(this.mapDecisionSnapshot),
  });

  private mapCaseDetails = (c: any) => ({
    id: c.id,
    customerId: c.customerId,
    loanId: c.loanId,
    dpd: c.dpd,
    stage: c.stage,
    status: c.status,
    assignedTo: c.assignedTo,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    customer: this.mapCustomer(c.customer),
    loan: this.mapLoan(c.loan),
    actions: c.actions.map(this.mapAction),
    decisions: c.decisions.map(this.mapDecision),
  });
}
