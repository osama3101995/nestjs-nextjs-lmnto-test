import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Assignment')
@Controller('api/cases')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post(':id/assign')
  async assignCase(@Param('id', ParseIntPipe) id: number) {
    return await this.assignmentService.assignCase(id);
  }
}
