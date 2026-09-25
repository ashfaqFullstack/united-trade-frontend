import api from '@/lib/axios';

export const getNotificationStatus = async (endpoint) => {
    const res = await api.get('/notifications/status', { params: { endpoint } });
    return res.data;
};

export const subscribeToPush = async (subscription) => {
    const res = await api.post('/notifications/subscribe', subscription);
    return res.data;
};