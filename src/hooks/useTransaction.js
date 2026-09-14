import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMyQrCode, sendTransaction, getReceipt, getMyTransactions } from '@/services/transaction.service';

export const useMyQrCode = () => {
    return useQuery({
        queryKey: ['myQrCode'],
        queryFn: getMyQrCode,
    });
};

export const useSendTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sendTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['myTransactions'] });
            toast.success('Trade dollars sent successfully!');
        },
    });
};

export const useReceipt = (receiptId) => {
    return useQuery({
        queryKey: ['receipt', receiptId],
        queryFn: () => getReceipt(receiptId),
        enabled: !!receiptId,
    });
};

export const useMyTransactions = (params) => {
    return useQuery({
        queryKey: ['myTransactions', params],
        queryFn: () => getMyTransactions(params),
    });
};