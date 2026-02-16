import { Injectable } from '@nestjs/common';
import { ActionLogBase, CaseBase, CustomerBase, LoanBase } from '@repo/shared';



@Injectable()
export class PdfTemplateService {

  generateCaseHtml(caseData: CaseBase & { customer: CustomerBase; loan: LoanBase; actions: ActionLogBase[] }): string {
    const { customer, loan, actions, dpd, stage, status, assignedTo } = caseData;

    const lastActions = actions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3);

    const payByDate = loan.dueDate.toISOString().split('T')[0];
    const generatedAt = new Date().toISOString();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CaseBase Notice</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
    header { text-align: center; margin-bottom: 30px; }
    h1 { font-size: 18px; margin: 0; }
    section { margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    table, th, td { border: 1px solid #ccc; }
    th, td { padding: 6px; text-align: left; }
    footer { text-align: center; margin-top: 30px; font-size: 10px; color: #666; }
  </style>
</head>
<body>
  <header>
    <h1>Company Logo / Header Placeholder</h1>
  </header>

  <section>
    <h2>CustomerBase Info</h2>
    <table>
      <tr><th>Name</th><td>${customer.name}</td></tr>
      <tr><th>Phone</th><td>${customer.phone}</td></tr>
      <tr><th>Email</th><td>${customer.email}</td></tr>
      <tr><th>Country</th><td>${customer.country}</td></tr>
      <tr><th>Risk Score</th><td>${customer.riskScore}</td></tr>
    </table>
  </section>

  <section>
    <h2>Loan Info</h2>
    <table>
      <tr><th>Principal</th><td>${loan.principal}</td></tr>
      <tr><th>Outstanding</th><td>${loan.outstanding}</td></tr>
      <tr><th>Due Date</th><td>${loan.dueDate.toISOString().split('T')[0]}</td></tr>
      <tr><th>Status</th><td>${loan.status}</td></tr>
      <tr><th>Pay-by Date</th><td>${payByDate}</td></tr>
    </table>
  </section>

  <section>
    <h2>CaseBase Info</h2>
    <table>
      <tr><th>Stage</th><td>${stage}</td></tr>
      <tr><th>Status</th><td>${status}</td></tr>
      <tr><th>Assigned To</th><td>${assignedTo || 'Unassigned'}</td></tr>
      <tr><th>DPD</th><td>${dpd}</td></tr>
    </table>
  </section>

  <section>
    <h2>Last Actions</h2>
    <table>
      <tr><th>Type</th><th>Outcome</th><th>Notes</th><th>Date</th></tr>
      ${lastActions
        .map(
          (a) => `
        <tr>
          <td>${a.type}</td>
          <td>${a.outcome}</td>
          <td>${a.notes || '-'}</td>
          <td>${a.createdAt.toISOString()}</td>
        </tr>
      `,
        )
        .join('')}
    </table>
  </section>

  <footer>
    Generated at ${generatedAt}
  </footer>
</body>
</html>
    `;
  }
}
