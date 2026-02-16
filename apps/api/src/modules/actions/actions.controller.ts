import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import {
  CreateActionSchema,
  ListActionsSchema,
} from '@repo/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('Actions')
@Controller('api/cases/:id/actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  @ApiParam({ name: 'id', type: Number })
  async addAction(
    @Param('id', ParseIntPipe) caseId: number,
    @Body(new ZodValidationPipe(CreateActionSchema)) dto: any,
  ) {
    const result = await this.actionsService.addAction(caseId, dto);

    return {
      success: true,
      data: result,
      message: 'Action logged successfully',
    };
  }

  @Get()
  @ApiParam({ name: 'id', type: Number })
  async getLastActions(
    @Param('id', ParseIntPipe) caseId: number,
    @Query(new ZodValidationPipe(ListActionsSchema)) query: any,
  ) {
    const result = await this.actionsService.getLastActions(
      caseId,
      query.limit,
    );

    return {
      success: true,
      data: result,
      meta: {
        caseId,
        count: result.length,
      },
    };
  }
}