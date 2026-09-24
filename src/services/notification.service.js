import api from '@/lib/axios';

export const subscribeToPush = async (subscription) => {
    const res = await api.post('/notifications/subscribe', subscription);
    return res.data;
};