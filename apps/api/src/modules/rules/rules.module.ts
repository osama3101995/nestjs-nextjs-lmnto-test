import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { RuleEvaluatorService } from './rule-evaluator/rule-evaluator.service';
import { RuleDecisionBuilder } from './rule-decision/rule-decision.builder';

@Module({
  imports: [],
  controllers: [RulesController],
  providers: [RulesService, RuleEvaluatorService, RuleDecisionBuilder],
  exports: [RuleEvaluatorService, RuleDecisionBuilder],
})
export class RulesModule {}
