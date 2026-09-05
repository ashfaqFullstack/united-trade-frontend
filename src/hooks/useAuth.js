import { useMutation } from '@tanstack/react-query';
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/lib/queryClient';

export const useRegister = () => {
    const setUser = useAuthStore((state) => state.setUser);
    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => setUser(data.user),
    });
};

export const useLogin = () => {
    const setUser = useAuthStore((state) => state.setUser);
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => setUser(data.user),
    });
};

export const useLogout = () => {
    const clearUser = useAuthStore((state) => state.clearUser);
    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            clearUser();
            queryClient.clear(); // manual logout — full cache clear
        },
    });
};

export const useForgotPassword = () => {
    return useMutation({ mutationFn: forgotPassword });
};

export const useResetPassword = () => {
    return useMutation({ mutationFn: resetPassword });
};