import {
  ActionOutcome,
  ActionType,
  CaseStage,
  CaseStatus,
  Loan,
  PrismaClient,
} from "../src/generated/prisma/client";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Checking if database already seeded...");

  const existingCustomer = await prisma.customer.findFirst();

  if (existingCustomer) {
    console.log("Database already seeded. Skipping seed.");
    return;
  }

  console.log("Seeding demo data...");

  await prisma.customer.createMany({
    data: [
      {
        name: "Alice Johnson",
        phone: "0501234567",
        email: "alice@example.com",
        country: "UAE",
        riskScore: 10,
      },
      {
        name: "Bob Smith",
        phone: "0502345678",
        email: "bob@example.com",
        country: "UAE",
        riskScore: 50,
      },
      {
        name: "Charlie Brown",
        phone: "0503456789",
        email: "charlie@example.com",
        country: "UAE",
        riskScore: 70,
      },
    ],
  });

  const allCustomers = await prisma.customer.findMany();

  const loans: Loan[] = [];

  for (const customer of allCustomers) {
    const loan = await prisma.loan.create({
      data: {
        customerId: customer.id,
        principal: 1000 + customer.riskScore * 10,
        outstanding: 1000 + customer.riskScore * 10,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      },
    });

    loans.push(loan);
  }

  for (const loan of loans) {
    await prisma.case.create({
      data: {
        customerId: loan.customerId,
        loanId: loan.id,
        dpd: Math.floor(Math.random() * 60),
        stage:
          loan.customerId % 2 === 0
            ? CaseStage.SOFT
            : CaseStage.HARD,
        status: CaseStatus.OPEN,
        assignedTo: `agent${loan.customerId}`,
      },
    });
  }

  const allCases = await prisma.case.findMany();

  for (const c of allCases) {
    const actionCount = 1 + Math.floor(Math.random() * 3);

    for (let i = 0; i < actionCount; i++) {
      await prisma.actionLog.create({
        data: {
          caseId: c.id,
          type:
            Object.values(ActionType)[
              i % Object.values(ActionType).length
            ],
          outcome:
            Object.values(ActionOutcome)[
              i % Object.values(ActionOutcome).length
            ],
          notes: `Demo note ${i + 1}`,
        },
      });
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
