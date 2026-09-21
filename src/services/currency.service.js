import api from '@/lib/axios';

export const getCurrencyRates = async () => {
    const res = await api.get('/currency-rates');
    return res.data;
};

export const createCurrencyRate = async (data) => {
    const res = await api.post('/currency-rates', data);
    return res.data;
};

export const updateCurrencyRate = async ({ rateId, data }) => {
    const res = await api.patch(`/currency-rates/${rateId}`, data);
    return res.data;
};

export const deleteCurrencyRate = async (rateId) => {
    const res = await api.delete(`/currency-rates/${rateId}`);
    return res.data;
};