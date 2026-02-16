export * from "../src/types/api.responses";
export * from "../src/modules/cases/types/assignment-result.type";


export * from './common/pagination/pagination.schema';

export * from './modules/actions/enums/action.enums';
export * from './modules/actions/dto/create-action.schema';
export * from './modules/actions/dto/list-actions.schema';

export * from './modules/cases/dto/create-case.schema';
export * from './modules/cases/dto/list-cases.schema';

export * from './modules/rules/types/assignment-rule.types';
export * from './modules/rules/dto/create-rule.schema';
export * from './modules/rules/dto/list-rules.schema';



// Import the raw values/types
import { 
  CaseStatus as _CaseStatus, 
  CaseStage as _CaseStage 
} from '@repo/database/enums';

// Re-export them with explicit types
export const CaseStatus = _CaseStatus as Record<string, string>;
export type CaseStatus = _CaseStatus;

export const CaseStage = _CaseStage as Record<string, string>;
export type CaseStage = _CaseStage;