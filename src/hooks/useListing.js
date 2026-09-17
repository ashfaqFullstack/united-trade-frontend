import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getListingUploadSignature,
    createListing,
    updateListing,
    deleteListing,
    getMyListings,
    getListings,
    getListing,
} from '@/services/listing.service';

export const useListingUploadSignature = () => {
    return useMutation({ mutationFn: getListingUploadSignature });
};

export const useCreateListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myListings'] });
            toast.success('Listing published successfully');
        },
    });
};

export const useUpdateListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myListings'] });
            toast.success('Listing updated successfully');
        },
    });
};

export const useDeleteListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myListings'] });
            toast.success('Listing deleted');
        },
    });
};

export const useMyListings = () => {
    return useQuery({ queryKey: ['myListings'], queryFn: getMyListings });
};

export const useListings = (params) => {
    return useQuery({ queryKey: ['listings', params], queryFn: () => getListings(params) });
};

export const useListingDetail = (listingId) => {
    return useQuery({
        queryKey: ['listing', listingId],
        queryFn: () => getListing(listingId),
        enabled: !!listingId,
    });
};