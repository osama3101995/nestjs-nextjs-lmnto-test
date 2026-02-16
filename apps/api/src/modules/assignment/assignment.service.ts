import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RuleEvaluatorService } from '../rules/rule-evaluator/rule-evaluator.service';
import { RuleDecisionBuilder } from '../rules/rule-decision/rule-decision.builder';
import { CaseStatus } from '@repo/database/enums';
import { AssignmentResult, RuleDecisionBase, RuleDecisionSnapshotBase } from '@repo/shared';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ruleEvaluator: RuleEvaluatorService,
    private readonly decisionBuilder: RuleDecisionBuilder,
  ) {}

  async assignCase(caseId: number): Promise<AssignmentResult> {
    return this.prisma.$transaction(async (tx) => {
      const caseData = await tx.case.findUnique({
        where: { id: caseId },
        include: {
          customer: true,
          loan: true,
          decisions: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      });
      if (!caseData) throw new NotFoundException('Case not found');

      const evaluation = await this.ruleEvaluator.evaluate(caseData, caseData.customer, caseData.loan);

      const decisionPayload = this.decisionBuilder.build(evaluation.matchedRules, {
        case: caseData,
        customer: caseData.customer,
        loan: caseData.loan,
      });

      const lastDecision = caseData.decisions[0] ?? null;

      if (
        lastDecision &&
        JSON.stringify(lastDecision.matchedRules) === JSON.stringify(decisionPayload.matchedRules) &&
        lastDecision.reason === decisionPayload.reason
      ) {
        return {
          success: true,
          unchanged: true,
          data: {
            assignedTo: caseData.assignedTo,
            stage: caseData.stage,
            decision: this.mapDecision(lastDecision),
          },
          message: 'Assignment unchanged (idempotent)',
        };
      }

      const decision = await tx.ruleDecision.create({
        data: {
          caseId: caseData.id,
          matchedRules: decisionPayload.matchedRules,
          reason: decisionPayload.reason,
          snapshots: {
            create: {
              assignedTo: evaluation.finalEffects.assignedTo ?? caseData.assignedTo,
              stage: evaluation.finalEffects.stage ?? caseData.stage,
            },
          },
        },
        include: { snapshots: true },
      });

      const updatedCase = await tx.case.update({
        where: { id: caseData.id },
        data: {
          assignedTo: evaluation.finalEffects.assignedTo ?? caseData.assignedTo,
          stage: evaluation.finalEffects.stage ?? caseData.stage,
          status: CaseStatus.IN_PROGRESS,
        },
      });

      return {
        success: true,
        unchanged: false,
        data: {
          assignedTo: updatedCase.assignedTo,
          stage: updatedCase.stage,
          decision: this.mapDecision(decision),
        },
        message: 'Case assigned and audit persisted successfully',
      };
    });
  }

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
    snapshots: (d.snapshots || []).map(this.mapDecisionSnapshot),
  });
}
