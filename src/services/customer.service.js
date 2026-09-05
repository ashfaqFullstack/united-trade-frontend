import api from '@/lib/axios';

export const completeCustomerProfile = async (data) => {
    const res = await api.post('/customer/profile', data);
    return res.data;
};

export const getCustomerProfile = async () => {
    const res = await api.get('/customer/profile');
    return res.data;
};

export const updateCustomerProfile = async (data) => {
    const res = await api.patch('/customer/profile', data);
    return res.data;
};