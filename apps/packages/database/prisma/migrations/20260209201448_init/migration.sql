-- CreateEnum
CREATE TYPE "CaseStage" AS ENUM ('SOFT', 'HARD', 'LEGAL');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CALL', 'SMS', 'EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "ActionOutcome" AS ENUM ('NO_ANSWER', 'PROMISE_TO_PAY', 'PAID', 'WRONG_NUMBER');

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "principal" DECIMAL(65,30) NOT NULL,
    "outstanding" DECIMAL(65,30) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "loanId" INTEGER NOT NULL,
    "dpd" INTEGER NOT NULL,
    "stage" "CaseStage" NOT NULL,
    "status" "CaseStatus" NOT NULL,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionLog" (
    "id" SERIAL NOT NULL,
    "caseId" INTEGER NOT NULL,
    "type" "ActionType" NOT NULL,
    "outcome" "ActionOutcome" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuleDecision" (
    "id" SERIAL NOT NULL,
    "caseId" INTEGER NOT NULL,
    "matchedRules" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuleDecision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Loan_customerId_idx" ON "Loan"("customerId");

-- CreateIndex
CREATE INDEX "Case_status_stage_dpd_idx" ON "Case"("status", "stage", "dpd");

-- CreateIndex
CREATE INDEX "Case_assignedTo_idx" ON "Case"("assignedTo");

-- CreateIndex
CREATE INDEX "ActionLog_caseId_createdAt_idx" ON "ActionLog"("caseId", "createdAt");

-- CreateIndex
CREATE INDEX "RuleDecision_caseId_idx" ON "RuleDecision"("caseId");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionLog" ADD CONSTRAINT "ActionLog_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleDecision" ADD CONSTRAINT "RuleDecision_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;



CREATE UNIQUE INDEX unique_active_case_per_loan 
ON "Case" ("loanId") 
WHERE status != 'CLOSED';