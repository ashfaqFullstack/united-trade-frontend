import api from '@/lib/axios';

export const createBarterOffer = async (data) => {
    const res = await api.post('/barter-offers', data);
    return res.data;
};

export const acceptBarterOffer = async (offerId) => {
    const res = await api.patch(`/barter-offers/${offerId}/accept`);
    return res.data;
};

export const rejectBarterOffer = async (offerId) => {
    const res = await api.patch(`/barter-offers/${offerId}/reject`);
    return res.data;
};

export const cancelBarterOffer = async (offerId) => {
    const res = await api.patch(`/barter-offers/${offerId}/cancel`);
    return res.data;
};

export const getMyBarterOffers = async () => {
    const res = await api.get('/barter-offers/me');
    return res.data;
};

export const getReceivedBarterOffers = async () => {
    const res = await api.get('/barter-offers/received');
    return res.data;
};

export const getBarterOfferDetail = async (offerId) => {
    const res = await api.get(`/barter-offers/${offerId}`);
    return res.data;
};