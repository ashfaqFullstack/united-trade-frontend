'use client';

import { useEffect } from 'react';
import { getMe } from '@/services/user.service';
import { useAuthStore } from '@/store/useAuthStore';

export default function SessionProvider({ children }) {
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);
    const hasHydrated = useAuthStore((state) => state.hasHydrated);

    useEffect(() => {
        getMe()
            .then((user) => setUser(user))
            .catch(() => clearUser());
    }, []);

    if (!hasHydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F4F6FF]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    return children;
}