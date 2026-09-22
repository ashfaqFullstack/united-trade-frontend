import api from "@/lib/axios";

export const getPendingUsers = async (params) => {
    const res = await api.get('/admin/users/pending', { params });
    return res.data;
};

export const approveUser = async ({ userId, creditLimit }) => {
    const res = await api.patch(`/admin/users/${userId}/approve`, { creditLimit });
    return res.data;
};

export const rejectUser = async ({ userId, reason }) => {
    const res = await api.patch(`/admin/users/${userId}/reject`, { reason });
    return res.data;
};

export const getUserDetails = async (userId) => {
    const res = await api.get(`/admin/users/${userId}`);
    return res.data;
};

export const getAllUsers = async (params) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
};

export const blockUser = async (userId) => {
    const res = await api.patch(`/admin/users/${userId}/block`);
    return res.data;
};

export const unblockUser = async (userId) => {
    const res = await api.patch(`/admin/users/${userId}/unblock`);
    return res.data;
};

export const fundAdminWallet = async (amount) => {
    const res = await api.post('/admin/company-account/fund-wallet', { amount });
    return res.data;
};