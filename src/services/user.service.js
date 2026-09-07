import api from "@/lib/axios";

export const getMe = async () => {
    const res = await api.get('/users/me', { skipErrorToast: true });
    return res.data;
};