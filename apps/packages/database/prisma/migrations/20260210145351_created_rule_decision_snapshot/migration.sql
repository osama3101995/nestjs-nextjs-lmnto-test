-- CreateTable
CREATE TABLE "RuleDecisionSnapshot" (
    "id" SERIAL NOT NULL,
    "ruleDecisionId" INTEGER NOT NULL,
    "assignedTo" TEXT,
    "stage" "CaseStage" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuleDecisionSnapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RuleDecisionSnapshot" ADD CONSTRAINT "RuleDecisionSnapshot_ruleDecisionId_fkey" FOREIGN KEY ("ruleDecisionId") REFERENCES "RuleDecision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
