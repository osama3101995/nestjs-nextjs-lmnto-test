import { Injectable, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { PdfTemplateService } from './pdf.template';
import { ActionLogBase, CaseBase, CustomerBase, LoanBase } from '@repo/shared';

@Injectable()
export class PdfService implements OnModuleDestroy { 
  constructor(private readonly templateService: PdfTemplateService) {} 
  private browser: Browser | null = null;

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browser;
  }

  async onModuleDestroy() {
    await this.closeBrowser();
  }

  async generatePdfFromCase(
    caseData: CaseBase & { customer: CustomerBase; loan: LoanBase; actions: ActionLogBase[] },
  ): Promise<Buffer> {
    const html = this.templateService.generateCaseHtml(caseData); 
    const browser = await this.getBrowser();
    const page: Page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await page.close();
    return Buffer.from(pdfUint8Array);
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}