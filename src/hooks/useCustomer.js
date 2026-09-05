import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { completeCustomerProfile, getCustomerProfile, updateCustomerProfile } from '@/services/customer.service';
import { toast } from 'sonner';

export const useCompleteCustomerProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeCustomerProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customerProfile'] });
            toast.success('Profile completed successfully');
        },
    });
};

export const useUpdateCustomerProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCustomerProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customerProfile'] });
            toast.success('Profile updated successfully');
        },
    });
};