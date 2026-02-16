import { Test, TestingModule } from '@nestjs/testing';
import { RuleEvaluatorService } from './rule-evaluator.service';
import { PrismaService } from 'src/prisma/prisma.service';

class MockPrismaService {
  assignmentRule = {
    findMany: jest.fn().mockResolvedValue([
      {
        code: 'RULE_TEST',
        priority: 100,
        conditions: [{ field: 'case.dpd', operator: 'gt', value: 30 }],
        effects: { stage: 'HARD', assignGroup: 'TEAM_A' },
        isOverride: false,
        enabled: true,
      },
    ]),
  };
}

describe('RuleEvaluatorService', () => {
  let service: RuleEvaluatorService;

  beforeEach(async () => {
const module: TestingModule = await Test.createTestingModule({
  providers: [
    RuleEvaluatorService,
    { provide: PrismaService, useClass: MockPrismaService },
  ],
}).compile();

    service = module.get<RuleEvaluatorService>(RuleEvaluatorService);
  });

  it('should evaluate a simple rule', async () => {
    const caseData = { dpd: 45 };
    const customerData = { riskScore: 70 };
    const loanData = { principal: 1000 };

    const { finalEffects, matchedRules } = await service.evaluate(
      caseData,
      customerData,
      loanData,
    );

    expect(finalEffects).toBeDefined();
    expect(matchedRules).toBeInstanceOf(Array);
  });
});
