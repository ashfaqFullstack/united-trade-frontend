import { useMutation } from '@tanstack/react-query';
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';
export const useRegister = () => {
    const setUser = useAuthStore((state) => state.setUser);
    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setUser(data.user);
            toast.success('Account created successfully!');
        },
    });
};

export const useLogin = () => {
    const setUser = useAuthStore((state) => state.setUser);
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setUser(data.user);
            toast.success(`Welcome back, ${data.user.name}!`);
        },
    });
};

export const useLogout = () => {
    const clearUser = useAuthStore((state) => state.clearUser);
    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            clearUser();
            queryClient.clear();
            toast.success('Logged out successfully');
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