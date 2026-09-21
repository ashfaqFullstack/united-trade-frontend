import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getCurrencyRates,
    createCurrencyRate,
    updateCurrencyRate,
    deleteCurrencyRate,
} from '@/services/currency.service';

// enabled=false by default — nobody accidentally fetches this unless
// a page explicitly opts in.
export const useCurrencyRates = (enabled = true) => {
    return useQuery({
        queryKey: ['currencyRates'],
        queryFn: getCurrencyRates,
        enabled,
    });
};

export const useCreateCurrencyRate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCurrencyRate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currencyRates'] });
            toast.success('Currency rate added');
        },
    });
};

export const useUpdateCurrencyRate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCurrencyRate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currencyRates'] });
            toast.success('Currency rate updated');
        },
    });
};

export const useDeleteCurrencyRate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCurrencyRate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currencyRates'] });
            toast.success('Currency rate removed');
        },
    });
};