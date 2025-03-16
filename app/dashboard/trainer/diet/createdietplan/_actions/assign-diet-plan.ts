'use client';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface AssignDietPlanInput {
  userId: number;
  dietPlanId: number;
}

export function useAssignDietPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, dietPlanId }: AssignDietPlanInput) => {
      const trainerAxios = await TrainerReqConfig();
      
      const response = await trainerAxios.post('/diet/assigndiettouser', {
        userId,
        dietPlanId,
      });
      
      if (response.status !== 200) {
        throw new Error(response.data.msg || 'Failed to assign diet plan');
      }
      
      return response.data.data;
    },
    onMutate: async (newAssignment) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ 
        queryKey: ['user', newAssignment.userId] 
      });
      await queryClient.cancelQueries({ 
        queryKey: ['userDietPlan', newAssignment.userId] 
      });
      
      // Get current data
      const previousUserData = queryClient.getQueryData(['user', newAssignment.userId]);
      
      // Optimistically update the cache
      queryClient.setQueryData(['user', newAssignment.userId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          dietPlanId: newAssignment.dietPlanId,
          isOptimisticUpdate: true
        };
      });
      
      // Return context with previous values
      return { previousUserData };
    },
    onSuccess: (data, variables) => {
      // Update queries that may be affected
      queryClient.invalidateQueries({ 
        queryKey: ['user', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['userDietPlan', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['userAssignments'] 
      });
      
      toast.success('Diet plan assigned successfully');
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousUserData) {
        queryClient.setQueryData(
          ['user', variables.userId], 
          context.previousUserData
        );
      }
      
      const axiosError = error as AxiosError<{ msg: string }>;
      toast.error(axiosError.response?.data?.msg || 'Failed to assign diet plan');
    }
  });
}
