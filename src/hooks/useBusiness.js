import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    completeBusinessProfile,
    getBusinessProfile,
    getUploadSignature,
    saveBusinessDocuments,
} from '@/services/business.service';
import { toast } from 'sonner';
export const useCompleteBusinessProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeBusinessProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businessProfile'] });
            toast.success('Business profile completed');
        },
    });
};

export const useSaveBusinessDocuments = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveBusinessDocuments,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businessProfile'] });
            toast.success('Documents uploaded successfully');
        },
    });
};