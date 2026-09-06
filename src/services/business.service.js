import api from '@/lib/axios';

export const completeBusinessProfile = async (data) => {
    const res = await api.post('/business/profile', data);
    return res.data;
};

export const getBusinessProfile = async () => {
    const res = await api.get('/business/profile');
    return res.data;
};

export const getUploadSignature = async () => {
    const res = await api.get('/business/documents/signature');
    return res.data;
};

export const saveBusinessDocuments = async (payload) => {
    const res = await api.post('/business/documents', payload);
    return res.data;
};

export const uploadToCloudinary = async ({ file, signatureData }) => {
    const { timestamp, signature, apiKey, cloudName, folder } = signatureData;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);
    formData.append('type', 'authenticated');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
    });
    return res.json();
};

