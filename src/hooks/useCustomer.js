import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { completeCustomerProfile, getCustomerProfile, updateCustomerProfile } from '@/services/customer.service';

export const useCompleteCustomerProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeCustomerProfile,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerProfile'] }),
    });
};

export const useCustomerProfile = () => {
    return useQuery({
        queryKey: ['customerProfile'],
        queryFn: getCustomerProfile,
        retry: false,
    });
};

export const useUpdateCustomerProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCustomerProfile,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerProfile'] }),
    });
};