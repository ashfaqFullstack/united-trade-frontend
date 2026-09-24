import api from '@/lib/axios';

export const createProfileUpdateRequest = async (data) => {
    const res = await api.post('/profile-update-requests', data);
    return res.data;
};

export const getMyPendingRequest = async () => {
    const res = await api.get('/profile-update-requests/me', { skipErrorToast: true });
    return res.data;
};