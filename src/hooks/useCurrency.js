
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getConversionPreview, getCurrencyRates, getMyCurrency } from '@/services/currency.service';

export const useCurrencyRates = (enabled = true) => {
    return useQuery({
        queryKey: ['currencyRates'],
        queryFn: getCurrencyRates,
        enabled,
        staleTime: 10 * 60 * 1000,
    });
};

export const useMyCurrency = (enabled = true) => {
    return useQuery({
        queryKey: ['myCurrency'],
        queryFn: getMyCurrency,
        enabled,
        staleTime: 10 * 60 * 1000,
    });
};

// Powers "Receiver will get ≈ X" under the amount input.
export const useConversionPreview = ({ receiverId, amount }, enabled = true) => {
    const numeric = Number(amount);
    return useQuery({
        queryKey: ['conversionPreview', receiverId, numeric],
        queryFn: () => getConversionPreview({ receiverId, amount: numeric }),
        enabled: enabled && !!receiverId && numeric > 0,
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
};