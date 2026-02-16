import { Controller, Get, Res, Param, NotFoundException } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ApiTags, ApiOperation, ApiResponse, ApiProduces } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Response } from 'express';

@ApiTags('PDF')
@Controller('api/cases')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly prisma: PrismaService,
  ) {}

  @Get(':id/notice.pdf')
  @ApiOperation({ summary: 'Generate and download a Case Notice PDF' })
  @ApiProduces('application/pdf') 
  @ApiResponse({
    status: 200,
    description: 'The generated PDF file',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiResponse({ status: 404, description: 'Case not found' })
  async downloadCasePdf(@Param('id') id: string, @Res() res: Response) {
    const caseId = parseInt(id);

    const caseData = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: {
        customer: true,
        loan: true,
        actions: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!caseData) throw new NotFoundException('Case not found');

    const mapped = {
      ...caseData,
      loan: {
        ...caseData.loan,
        principal: caseData.loan.principal.toString(),
        outstanding: caseData.loan.outstanding.toString(),
      },
    };

    const pdfBuffer = await this.pdfService.generatePdfFromCase(mapped);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=case_${caseId}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer); 
  }
}