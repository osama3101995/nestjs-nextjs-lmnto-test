export { PrismaClient } from "./generated/prisma/client";

export {
  CaseStage,
  CaseStatus,
  ActionType,
  ActionOutcome,
} from "./generated/prisma/client";

export type {
  Prisma,
  ActionLog,
  Case,
  Customer,
  Loan,
} from "./generated/prisma/client";

export { PrismaPg } from "@prisma/adapter-pg";
