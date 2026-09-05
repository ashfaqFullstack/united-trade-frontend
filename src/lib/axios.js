import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/lib/queryClient';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

const clearSessionAndRedirect = () => {
    useAuthStore.getState().clearUser();
    queryClient.clear(); // clears ALL cached data — manual or auto logout dono cases
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingRequests.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            isRefreshing = true;

            try {
                await api.post('/auth/refresh-token');
                pendingRequests.forEach((p) => p.resolve());
                pendingRequests = [];
                return api(originalRequest);
            } catch (refreshError) {
                pendingRequests.forEach((p) => p.reject(refreshError));
                pendingRequests = [];
                clearSessionAndRedirect();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;