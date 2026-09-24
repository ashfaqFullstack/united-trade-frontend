import api from '@/lib/axios';

export const getNotificationStatus = async () => {
    const res = await api.get('/notifications/status');
    return res.data;
};

export const subscribeToPush = async (subscription) => {
    const res = await api.post('/notifications/subscribe', subscription);
    return res.data;
};