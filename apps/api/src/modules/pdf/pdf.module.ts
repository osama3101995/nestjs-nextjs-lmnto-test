import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { PdfTemplateService } from './pdf.template';

@Module({
  imports: [],
  controllers: [PdfController],
  providers: [PdfService, PdfTemplateService],
  exports: [PdfService],
})
export class PdfModule {}
