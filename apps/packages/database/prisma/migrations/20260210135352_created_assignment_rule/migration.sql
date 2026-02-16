-- CreateTable
CREATE TABLE "AssignmentRule" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "conditions" JSONB NOT NULL,
    "effects" JSONB NOT NULL,
    "isOverride" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentRule_code_key" ON "AssignmentRule"("code");

-- CreateIndex
CREATE INDEX "AssignmentRule_priority_idx" ON "AssignmentRule"("priority");

-- CreateIndex
CREATE INDEX "AssignmentRule_enabled_idx" ON "AssignmentRule"("enabled");
