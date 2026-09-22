import api from '@/lib/axios';

export const getCompanyAccount = async () => {
    const res = await api.get('/admin/company-account');
    return res.data;
};

export const getAllTransactions = async (params) => {
    const res = await api.get('/admin/transactions', { params });
    return res.data;
};

export const getFeeLogs = async (params) => {
    const res = await api.get('/admin/fees/logs', { params });
    return res.data;
};

export const getDashboardStats = async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
};

export const getSalesChart = async (days = 7) => {
    const res = await api.get('/admin/dashboard/sales-chart', { params: { days } });
    return res.data;
};