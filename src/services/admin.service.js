import api from '@/lib/axios';

export const getPendingUsers = async (params) => {
    const res = await api.get('/admin/users/pending', { params });
    return res.data;
};