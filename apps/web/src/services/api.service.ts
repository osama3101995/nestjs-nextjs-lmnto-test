import { 
  ListCasesResponse, 
  CaseDetailsResponse, 
  CreateActionResponse,
  AssignmentResult,
  CreateCaseResponse,
  CreateCaseDto,
  CreateCaseSchema,
  CreateActionDto,
  CreateActionSchema,
  ListCasesDto,
  ListCasesSchema,
  DashboardStatsResponse,
  ActionLogListResponse,
  CreateRuleDto,
  CreateRuleSchema,
  CreateRuleResponse,
  ListRulesResponse
} from '@repo/shared';
import { api } from '@/lib/api-client';

export const CaseApi = {
  getCases: async (params: ListCasesDto): Promise<ListCasesResponse> => {
    const validated = ListCasesSchema.parse(params);
    const response = await api.get<ListCasesResponse>('/cases', { params: validated });
    return response.data;
  },

  getCaseById: async (id: number): Promise<CaseDetailsResponse> => {
    const response = await api.get<CaseDetailsResponse>(`/cases/${id}`);
    return response.data;
  },

  createCase: async (payload: CreateCaseDto): Promise<CreateCaseResponse> => {
    const validated = CreateCaseSchema.parse(payload);
    const response = await api.post<CreateCaseResponse>('/cases', validated);
    return response.data;
  },

  addActionLog: async (caseId: number, payload: CreateActionDto): Promise<CreateActionResponse> => {
    const validated = CreateActionSchema.parse(payload);
    const response = await api.post<CreateActionResponse>(`/cases/${caseId}/actions`, validated);
    return response.data;
  },

  runAssignment: async (caseId: number): Promise<AssignmentResult> => {
    const response = await api.post<AssignmentResult>(`/cases/${caseId}/assign`);
    return response.data;
  },

  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const response = await api.get<DashboardStatsResponse>('/dashboard/stats');
    return response.data;
  },

  getCaseActions: async (caseId: number): Promise<ActionLogListResponse> => {
    const response = await api.get<ActionLogListResponse>(`/cases/${caseId}/actions`);
    return response.data;
  },

  getPdfNotice: async (caseId: number): Promise<void> => {
    const response = await api.get(`/cases/${caseId}/notice.pdf`, { 
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Notice_Case_${caseId}_${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

export const RuleApi = {
  getRules: async (): Promise<ListRulesResponse> => {
    const response = await api.get<ListRulesResponse>('/rules');
    return response.data;
  },

  createRule: async (payload: CreateRuleDto): Promise<CreateRuleResponse> => {
    const validated = CreateRuleSchema.parse(payload);
    const response = await api.post<CreateRuleResponse>('/rules', validated);
    return response.data;
  }
};