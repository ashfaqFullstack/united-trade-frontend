import api from "@/lib/axios";

export const getPendingUsers = async (params) => {
    const res = await api.get('/admin/users/pending', { params });
    return res.data;
};

export const approveUser = async ({ userId, creditLimit }) => {
    const res = await api.patch(`/admin/users/${userId}/approve`, { creditLimit });
    return res.data;
};

export const rejectUser = async (userId) => {
    const res = await api.patch(`/admin/users/${userId}/reject`);
    return res.data;
};

export const getUserDetails = async (userId) => {
    const res = await api.get(`/admin/users/${userId}`);
    return res.data;
};