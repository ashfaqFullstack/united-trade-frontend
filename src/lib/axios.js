// import axios from 'axios';
// import { useAuthStore } from '@/store/useAuthStore';
// import { queryClient } from '@/lib/queryClient';
// import { toast } from 'sonner';

// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL,
//     withCredentials: true,
// });

// const clearSessionAndRedirect = () => {
//     useAuthStore.getState().clearUser();
//     queryClient.clear();
//     toast.error('Session expired. Please login again.');
//     if (typeof window !== 'undefined') {
//         window.location.href = '/login';
//     }
// };

// let isRefreshing = false;
// let pendingRequests = [];

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     pendingRequests.push({ resolve, reject });
//                 }).then(() => api(originalRequest));
//             }

//             isRefreshing = true;

//             try {
//                 await api.post('/auth/refresh-token');
//                 pendingRequests.forEach((p) => p.resolve());
//                 pendingRequests = [];
//                 return api(originalRequest);
//             } catch (refreshError) {
//                 pendingRequests.forEach((p) => p.reject(refreshError));
//                 pendingRequests = [];
//                 clearSessionAndRedirect();
//                 return Promise.reject(refreshError);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         const message = error.response?.data?.message || 'Something went wrong';
//         if (error.response?.status !== 401) {
//             toast.error(message);
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;


import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/lib/queryClient';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

const clearSessionAndRedirect = () => {
    const wasAuthenticated = useAuthStore.getState().isAuthenticated;

    useAuthStore.getState().clearUser();
    queryClient.clear();

    // Only show "session expired" + force redirect if the user WAS actually
    // logged in before. If they were never logged in (e.g. first visit to
    // /auth), this is normal — no toast, no forced redirect needed.
    if (wasAuthenticated) {
        toast.error('Session expired. Please login again.');
        if (typeof window !== 'undefined') {
            window.location.href = '/auth';
        }
    }
};

let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

        // Never attempt silent-refresh for auth endpoints themselves
        // (refresh-token, login, register, logout) — this was causing
        // an infinite recursive loop when refresh-token itself failed.
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
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

        if (error.response?.status === 401 && isAuthEndpoint) {
            // e.g. refresh-token call itself failed (no valid session at all)
            clearSessionAndRedirect();
        }

        const message = error.response?.data?.message || 'Something went wrong';
        if (error.response?.status !== 401 && !originalRequest?.skipErrorToast) {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;