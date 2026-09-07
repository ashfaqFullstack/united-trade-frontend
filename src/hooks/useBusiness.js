import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    completeBusinessProfile,
    getBusinessProfile,
    getUploadSignature,
    saveBusinessDocuments,
} from '@/services/business.service';
import { toast } from 'sonner';

export const useCompleteBusinessProfile = () => {
    return useMutation({
        mutationFn: completeBusinessProfile,
        onSuccess: () => {
            toast.success('Business details saved');
        },
    });
};

export const useBusinessProfile = (enabled = true) => {
    return useQuery({
        queryKey: ['businessProfile'],
        queryFn: getBusinessProfile,
        retry: false,
        enabled,
    });
};

export const useUploadSignature = () => {
    return useMutation({ mutationFn: getUploadSignature });
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