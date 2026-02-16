import { ActionOutcome, ActionType, CaseStage, CaseStatus} from '@repo/database/enums';



// export type CaseStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
// export const CaseStatus = {
//     OPEN: "OPEN",
//     IN_PROGRESS: "IN_PROGRESS",
//     RESOLVED: "RESOLVED",
//     CLOSED: "CLOSED",
// }


// export type CaseStage = "SOFT" | "HARD" | "LEGAL"
// export const CaseStage = {
//      SOFT: "SOFT",
//      HARD: "HARD",
//      LEGAL: "LEGAL",
// }



export class ApiResponse<T> {
  success!: boolean;

  message?: string;

  data!: T;
}

export class PaginatedResponse<T> {
  success!: boolean;

  items!: T[];

  meta!: {
    total: number;
    page: number;
    limit: number;
  };
}


export class CustomerBase {
  id!: number;
  name!: string;
  phone!: string;
  email!: string;
  country!: string;
  riskScore!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class LoanBase {
  id!: number;
  customerId!: number;
  principal!: string; 
  outstanding!: string; 
  dueDate!: Date;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class CaseBase {
  id!: number;
  customerId!: number;
  loanId!: number;
  dpd!: number;
  stage!: CaseStage;
  status!: CaseStatus;
  assignedTo?: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}


export class ListCasesItem {
  id!: number;
  dpd!: number;
  stage!: CaseStage;
  status!: CaseStatus;
  assignedTo?: string | null;
  customerName!: string;
  outstanding!: string;
  createdAt!: Date;
}

export class ActionLogBase {
  id!: number;
  caseId!: number;
  type!: ActionType;
  outcome!: ActionOutcome;
  notes?: string | null;
  createdAt!: Date;
}

export class ListCasesMeta {
  total!: number;
  page!: number;
  limit!: number;
}



export class RuleDecisionSnapshotBase {
  id!: number;
  ruleDecisionId!: number;

  assignedTo?: string | null;
  stage!: CaseStage;

  createdAt!: Date;
}

export class RuleDecisionBase {
  id!: number;
  caseId!: number;

  matchedRules!: unknown; // Json
  reason!: string;

  createdAt!: Date;

  snapshots!: RuleDecisionSnapshotBase[];
}

export class AssignmentRuleBase {
  id!: number;
  code!: string;
  priority!: number;

  conditions!: unknown; // Json
  effects!: unknown; // Json

  isOverride!: boolean;
  enabled!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}







export class CasePdfPayload {
  caseId!: number;

  stage!: CaseStage;
  status!: CaseStatus;

  customer!: CustomerBase;
  loan!: LoanBase;
  actions!: ActionLogBase[];
}


export class ActiveCaseByAssigneeItem {
  assignedTo!: string | null;
  count!: number;
}



export class CaseCountByStatusItem {
  status!: CaseStatus;
  count!: number;
}

export class ActiveCaseByAssigneeResponse {
  items!: ActiveCaseByAssigneeItem[];
}



export class CreateCaseResponse extends ApiResponse<CaseBase & { customer: CustomerBase, loan: LoanBase }> {}


export class CreateRuleResponse extends ApiResponse<AssignmentRuleBase> {}



export class CaseCountByStatusResponse extends ApiResponse<{items: CaseCountByStatusItem[]}> {
  items!: CaseCountByStatusItem[];
}


export class CaseDetailsResponse extends ApiResponse<CaseBase & {
  customer: CustomerBase;
  loan: LoanBase;
  actions: ActionLogBase[];
  decisions: any[];
}> {}

export class CreateActionResponse extends ApiResponse<ActionLogBase> {}

export class DashboardStatsResponse extends ApiResponse<{
  byStatus: { status: CaseStatus, count: number }[];
  byAssignee: { assignedTo: string | null, count: number }[];
}> {}




export class ListCasesResponse extends PaginatedResponse<ListCasesItem> {}

export class ListRulesResponse extends PaginatedResponse<AssignmentRuleBase> {}

export class ActionLogListResponse extends PaginatedResponse<ActionLogBase> {}
