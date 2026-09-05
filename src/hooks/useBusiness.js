import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    completeBusinessProfile,
    getBusinessProfile,
    getUploadSignature,
    saveBusinessDocuments,
} from '@/services/business.service';

export const useCompleteBusinessProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeBusinessProfile,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['businessProfile'] }),
    });
};

export const useBusinessProfile = () => {
    return useQuery({
        queryKey: ['businessProfile'],
        queryFn: getBusinessProfile,
        retry: false,
    });
};

export const useUploadSignature = () => {
    return useMutation({ mutationFn: getUploadSignature });
};

export const useSaveBusinessDocuments = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveBusinessDocuments,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['businessProfile'] }),
    });
};