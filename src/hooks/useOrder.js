import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    createOrder,
    completeOrder,
    cancelOrder,
    getMyOrders,
    getReceivedOrders,
} from '@/services/order.service';

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myOrders'] });
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            toast.success('Order placed — funds held in escrow');
        },
    });
};

export const useCompleteOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myOrders'] });
            queryClient.invalidateQueries({ queryKey: ['receivedOrders'] });
            toast.success('Order marked as complete — funds released to seller');
        },
    });
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myOrders'] });
            queryClient.invalidateQueries({ queryKey: ['receivedOrders'] });
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            toast.success('Order cancelled — funds refunded');
        },
    });
};

export const useMyOrders = () => useQuery({ queryKey: ['myOrders'], queryFn: getMyOrders });
export const useReceivedOrders = () => useQuery({ queryKey: ['receivedOrders'], queryFn: getReceivedOrders });