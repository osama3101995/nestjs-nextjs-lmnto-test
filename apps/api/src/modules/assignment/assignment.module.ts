import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { RuleEvaluatorService } from '../rules/rule-evaluator/rule-evaluator.service';
import { RuleDecisionBuilder } from '../rules/rule-decision/rule-decision.builder';

@Module({
  controllers: [AssignmentController],
  providers: [
    AssignmentService,
    RuleEvaluatorService,
    RuleDecisionBuilder,
  ],
})
export class AssignmentModule {}
