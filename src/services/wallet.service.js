import api from '@/lib/axios';

export const getMyWallet = async () => {
    const res = await api.get('/wallet/me', { skipErrorToast: true });
    return res.data;
};

export const setPin = async (data) => {
    const res = await api.post('/wallet/pin/set', data);
    return res.data;
};

export const changePin = async (data) => {
    const res = await api.post('/wallet/pin/change', data);
    return res.data;
};

export const forgotPin = async () => {
    const res = await api.post('/wallet/pin/forgot');
    return res.data;
};

export const resetPin = async (data) => {
    const res = await api.post('/wallet/pin/reset', data);
    return res.data;
};