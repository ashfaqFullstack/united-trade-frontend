import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getPendingUsers, getUserDetails, approveUser, rejectUser } from '@/services/admin.service';

export const usePendingUsers = (params, enabled = true) => {
    return useQuery({
        queryKey: ['pendingUsers', params],
        queryFn: () => getPendingUsers(params),
        enabled,
    });
};

export const useUserDetails = (userId) => {
    return useQuery({
        queryKey: ['userDetails', userId],
        queryFn: () => getUserDetails(userId),
        enabled: !!userId,
    });
};

export const useApproveUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveUser,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
            queryClient.invalidateQueries({ queryKey: ['userDetails', variables.userId] });
            toast.success('User approved successfully');
        },
    });
};

export const useRejectUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectUser,
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
            queryClient.invalidateQueries({ queryKey: ['userDetails', userId] });
            toast.success('User rejected');
        },
    });
};