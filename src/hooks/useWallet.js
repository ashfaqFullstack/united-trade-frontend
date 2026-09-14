import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMyWallet, setPin, changePin, forgotPin, resetPin } from '@/services/wallet.service';

export const useMyWallet = (enabled = true) => {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: getMyWallet,
        retry: false,
        enabled,
    });
};

export const useSetPin = () => {
    return useMutation({
        mutationFn: setPin,
        onSuccess: () => toast.success('Transaction PIN set successfully'),
    });
};

export const useChangePin = () => {
    return useMutation({
        mutationFn: changePin,
        onSuccess: () => toast.success('PIN changed successfully'),
    });
};

export const useForgotPin = () => {
    return useMutation({
        mutationFn: forgotPin,
        onSuccess: () => toast.success('OTP sent to your email'),
    });
};

export const useResetPin = () => {
    return useMutation({
        mutationFn: resetPin,
        onSuccess: () => toast.success('PIN reset successfully'),
    });
};