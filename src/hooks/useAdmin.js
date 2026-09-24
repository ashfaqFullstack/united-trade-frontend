import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getPendingUsers, getUserDetails, approveUser, rejectUser, fundAdminWallet, getProfileUpdateRequests,
    getProfileUpdateRequestDetail,
    approveProfileUpdateRequest,
    rejectProfileUpdateRequest,
} from '@/services/admin.service';
import { getAllUsers, blockUser, unblockUser } from '@/services/admin.service';

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
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
            queryClient.invalidateQueries({ queryKey: ['userDetails', variables.userId] });
            toast.success('User rejected');
        },
    });
};

export const useAllUsers = (params) => {
    return useQuery({ queryKey: ['allUsers', params], queryFn: () => getAllUsers(params) });
};

export const useBlockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: blockUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            toast.success('User account suspended');
        },
    });
};

export const useUnblockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: unblockUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            toast.success('User account reactivated');
        },
    });
};


export const useFundAdminWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fundAdminWallet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companyAccount'] });
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            toast.success('Wallet funded successfully');
        },
    });
};


export const useProfileUpdateRequests = (status = 'PENDING') => {
    return useQuery({
        queryKey: ['profileUpdateRequests', status],
        queryFn: () => getProfileUpdateRequests(status),
    });
};

export const useProfileUpdateRequestDetail = (requestId) => {
    return useQuery({
        queryKey: ['profileUpdateRequest', requestId],
        queryFn: () => getProfileUpdateRequestDetail(requestId),
        enabled: !!requestId,
    });
};

export const useApproveProfileUpdateRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveProfileUpdateRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profileUpdateRequests'] });
            toast.success('Profile update approved');
        },
    });
};

export const useRejectProfileUpdateRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectProfileUpdateRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profileUpdateRequests'] });
            toast.success('Profile update rejected');
        },
    });
};