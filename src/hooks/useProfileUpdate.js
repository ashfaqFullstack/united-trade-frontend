import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createProfileUpdateRequest, getMyPendingRequest } from '@/services/profileUpdate.service';

export const useMyPendingProfileUpdate = () => {
    return useQuery({ queryKey: ['myPendingProfileUpdate'], queryFn: getMyPendingRequest });
};

export const useSubmitProfileUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProfileUpdateRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myPendingProfileUpdate'] });
            toast.success('Your profile update has been submitted for review');
        },
    });
};