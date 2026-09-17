import api from '@/lib/axios';

export const createOrder = async (data) => {
    const res = await api.post('/orders', data);
    return res.data;
};

export const completeOrder = async (orderId) => {
    const res = await api.patch(`/orders/${orderId}/complete`);
    return res.data;
};

export const cancelOrder = async (orderId) => {
    const res = await api.patch(`/orders/${orderId}/cancel`);
    return res.data;
};

export const getMyOrders = async () => {
    const res = await api.get('/orders/me');
    return res.data;
};

export const getReceivedOrders = async () => {
    const res = await api.get('/orders/received');
    return res.data;
};