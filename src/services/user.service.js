import api from "@/lib/axios";

export const getMe = async () => {
    const res = await api.get('/users/me');
    return res.data;
};