'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileCompletion } from './useProfileCompletion';

// pageType: 'guest' | 'onboarding' | 'pendingApproval' | 'protected'
export const useRouteGuard = (pageType = 'protected') => {
    const router = useRouter();
    const { user, isAuthenticated, hasHydrated } = useAuthStore();

    // Profile-completion check now runs for ALL page types (including
    // 'guest') — but the underlying query is only `enabled` when the
    // person is actually authenticated, so a logged-out visit to /auth
    // still fires zero extra API calls. We need this on 'guest' too so
    // it can redirect to the CORRECT destination (onboarding / pending /
    // home) instead of always assuming home.
    const { isComplete, isLoading } = useProfileCompletion(isAuthenticated);

    let redirectTo = null;
    const stillChecking = !hasHydrated || (isAuthenticated && isLoading);

    if (!stillChecking) {
        if (pageType === 'guest') {
            if (isAuthenticated) {
                if (!isComplete) redirectTo = '/onboarding';
                else if (user.status !== 'APPROVED') redirectTo = '/pending-approval';
                else redirectTo = '/';
            }
        } else if (!isAuthenticated) {
            redirectTo = '/auth';
        } else if (pageType === 'onboarding') {
            if (isComplete) redirectTo = user.status === 'APPROVED' ? '/' : '/pending-approval';
        } else if (pageType === 'pendingApproval') {
            if (!isComplete) redirectTo = '/onboarding';
            else if (user.status === 'APPROVED') redirectTo = '/';
        } else {
            if (user.role === 'ADMIN') {
                // admins skip onboarding + approval entirely
            } else if (!isComplete) {
                redirectTo = '/onboarding';
            } else if (user.status !== 'APPROVED') {
                redirectTo = '/pending-approval';
            }
        }
    }

    useEffect(() => {
        if (redirectTo) router.replace(redirectTo);
    }, [redirectTo]);

    return { isChecking: stillChecking || !!redirectTo };
};