
import api from '@/lib/axios';

// Read-only. Rates are refreshed automatically by the backend — nothing to add/edit.
export const getCurrencyRates = async () => {
    const res = await api.get('/currency-rates');
    return res.data; // { base: 'USD', updatedAt, rates: { PKR: 280.1, ... } }
};

export const getMyCurrency = async () => {
    const res = await api.get('/currency-rates/me');
    return res.data; // { currencyCode: 'PKR', rate: 280.1 }
};

export const getConversionPreview = async ({ receiverId, amount }) => {
    const res = await api.get('/currency-rates/preview', { params: { receiverId, amount } });
    return res.data;
};