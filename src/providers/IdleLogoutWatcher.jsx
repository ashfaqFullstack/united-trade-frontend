'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/hooks/useAuth';
import { getLastActivityTime, markActivity } from '@/lib/activityTracker';

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const CHECK_INTERVAL_MS = 15 * 1000; // check every 15 seconds

export default function IdleLogoutWatcher() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { mutate: logout } = useLogout();

    useEffect(() => {
        if (!isAuthenticated) return;

        // Reset the timer once whenever this becomes active (e.g. right after login)
        markActivity();

        const interval = setInterval(() => {
            const idleFor = Date.now() - getLastActivityTime();
            if (idleFor >= IDLE_TIMEOUT_MS) {
                clearInterval(interval);
                toast.info("You've been logged out due to inactivity");
                logout();
            }
        }, CHECK_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    return null;
}