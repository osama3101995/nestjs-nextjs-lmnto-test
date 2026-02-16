-- DropIndex
DROP INDEX "AssignmentRule_enabled_idx";

-- DropIndex
DROP INDEX "AssignmentRule_priority_idx";

-- DropIndex
DROP INDEX "RuleDecision_caseId_idx";

-- CreateIndex
CREATE INDEX "AssignmentRule_enabled_priority_idx" ON "AssignmentRule"("enabled", "priority");

-- CreateIndex
CREATE INDEX "Case_customerId_idx" ON "Case"("customerId");

-- CreateIndex
CREATE INDEX "Case_loanId_idx" ON "Case"("loanId");

-- CreateIndex
CREATE INDEX "Case_createdAt_id_idx" ON "Case"("createdAt", "id");

-- CreateIndex
CREATE INDEX "RuleDecision_caseId_createdAt_idx" ON "RuleDecision"("caseId", "createdAt");
