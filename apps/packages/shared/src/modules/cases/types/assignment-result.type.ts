import { CaseStage } from "@repo/database/enums";


export type AssignmentResult = {
    success: boolean;
    unchanged: boolean;
    data: {
        assignedTo: string | null;
        stage: CaseStage;
        decision: {
            createdAt: Date;
            id: number;
            caseId: number;
            matchedRules: unknown;
            reason: string;
        };
    };
    message: string;
}
