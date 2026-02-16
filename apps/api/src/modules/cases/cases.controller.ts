import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import {
  CreateCaseSchema,
  ListCasesSchema,
} from '@repo/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('Cases')
@Controller('api/cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateCaseSchema))
  async create(@Body() dto: any) {
    const data = await this.casesService.createCase(dto);
    return {
      success: true,
      data,
      message: 'Case created successfully',
    };
  }

  @Get()
  @UsePipes(new ZodValidationPipe(ListCasesSchema))
  async list(@Query() query: any) {
    const { page, limit, ...filters } = query;
    return this.casesService.listCases(filters, { page, limit });
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.casesService.getCaseById(id);
    return {
      success: true,
      data,
    };
  }
}
