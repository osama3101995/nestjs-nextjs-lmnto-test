import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RulesService } from './rules.service';
import {
  CreateRuleSchema,
  ListRulesSchema,
} from '@repo/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('rules')
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateRuleSchema))
  async create(@Body() dto: any) {
    const data = await this.rulesService.createRule(dto);
    return {
      success: true,
      data,
      message: 'Rule created successfully',
    };
  }

  @Get()
  @UsePipes(new ZodValidationPipe(ListRulesSchema))
  async list(@Query() query: any) {
    const data = await this.rulesService.listRules(query.enabled);
    return {
      success: true,
      data,
    };
  }
}
