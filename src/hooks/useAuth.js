import { useMutation } from '@tanstack/react-query';
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

export const useRegister = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();
    const searchParams = useSearchParams();
    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setUser(data.user);
            toast.success('Account created successfully!');
            const next = searchParams.get('next');
            router.push(next || '/onboarding');
        },
    });
};

export const useLogin = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();
    const searchParams = useSearchParams();
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setUser(data.user);
            toast.success(`Welcome back, ${data.user.name}!`);
            const next = searchParams.get('next');
            router.push(next || '/onboarding');
        },
    });
};

export const useLogout = () => {
    const clearUser = useAuthStore((state) => state.clearUser);
    const router = useRouter();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            clearUser();
            queryClient.clear();
            toast.success('Logged out successfully');
            router.push('/');
        },
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => toast.success('OTP sent to your email'),
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
        onSuccess: () => toast.success('Password reset successfully'),
    });
};