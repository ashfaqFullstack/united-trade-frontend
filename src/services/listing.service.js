import api from '@/lib/axios';

export const getListingUploadSignature = async () => {
    const res = await api.get('/listings/upload-signature');
    return res.data;
};

export const uploadListingImage = async ({ file, signatureData }) => {
    const { timestamp, signature, apiKey, cloudName, folder } = signatureData;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
    });
    return res.json();
};

export const createListing = async (data) => {
    const res = await api.post('/listings', data);
    return res.data;
};

export const updateListing = async ({ listingId, data }) => {
    const res = await api.patch(`/listings/${listingId}`, data);
    return res.data;
};

export const deleteListing = async (listingId) => {
    const res = await api.delete(`/listings/${listingId}`);
    return res.data;
};

export const getMyListings = async () => {
    const res = await api.get('/listings/my-listings');
    return res.data;
};

export const getListings = async (params) => {
    const res = await api.get('/listings', { params });
    return res.data;
};

export const getListing = async (listingId) => {
    const res = await api.get(`/listings/${listingId}`);
    return res.data;
};