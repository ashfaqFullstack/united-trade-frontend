import api from '@/lib/axios';

export const getMyQrCode = async () => {
    const res = await api.get('/transactions/qr');
    return res.data;
};

export const sendTransaction = async (data) => {
    const res = await api.post('/transactions/send', data);
    return res.data;
};

export const getReceipt = async (receiptId) => {
    const res = await api.get(`/transactions/${receiptId}`);
    return res.data;
};

export const getMyTransactions = async (params) => {
    const res = await api.get('/transactions/me', { params });
    return res.data;
};