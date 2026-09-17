import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    createBarterOffer,
    acceptBarterOffer,
    rejectBarterOffer,
    cancelBarterOffer,
    getMyBarterOffers,
    getReceivedBarterOffers,
    getBarterOfferDetail
} from '@/services/barter.service';

export const useCreateBarterOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBarterOffer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myBarterOffers'] });
            toast.success('Barter offer sent');
        },
    });
};

const invalidateOfferLists = (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['myBarterOffers'] });
    queryClient.invalidateQueries({ queryKey: ['receivedBarterOffers'] });
    queryClient.invalidateQueries({ queryKey: ['myListings'] });
};

export const useAcceptBarterOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: acceptBarterOffer,
        onSuccess: () => {
            invalidateOfferLists(queryClient);
            toast.success('Barter offer accepted');
        },
    });
};

export const useRejectBarterOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectBarterOffer,
        onSuccess: () => {
            invalidateOfferLists(queryClient);
            toast.success('Barter offer rejected');
        },
    });
};

export const useCancelBarterOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelBarterOffer,
        onSuccess: () => {
            invalidateOfferLists(queryClient);
            toast.success('Offer cancelled');
        },
    });
};

export const useBarterOfferDetail = (offerId) => {
    return useQuery({
        queryKey: ['barterOffer', offerId],
        queryFn: () => getBarterOfferDetail(offerId),
        enabled: !!offerId,
    });
};

export const useMyBarterOffers = () => useQuery({ queryKey: ['myBarterOffers'], queryFn: getMyBarterOffers });
export const useReceivedBarterOffers = () => useQuery({ queryKey: ['receivedBarterOffers'], queryFn: getReceivedBarterOffers });