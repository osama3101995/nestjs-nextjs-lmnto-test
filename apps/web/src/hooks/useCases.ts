import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CaseApi } from '@/services/api.service';
import { ListCasesDto, CreateActionDto } from '@repo/shared';

export function useCases(filters: ListCasesDto) {
  return useQuery({
    queryKey: ['cases', filters],
    queryFn: async () => {
      const response = await CaseApi.getCases(filters);
      return response;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
  });
}

export function useCaseDetails(id: number) {
  return useQuery({
    queryKey: ['case', id],
    queryFn: () => CaseApi.getCaseById(id),
    enabled: !!id,
    staleTime: 30000, 
    placeholderData: (previousData) => previousData,
  });
}

export function useCaseActions(caseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateActionDto) => CaseApi.addActionLog(caseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
    },
  });
}