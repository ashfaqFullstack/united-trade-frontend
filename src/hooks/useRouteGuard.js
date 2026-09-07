'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileCompletion } from './useProfileCompletion';

// pageType: 'guest' | 'onboarding' | 'pendingApproval' | 'protected'
export const useRouteGuard = (pageType = 'protected') => {
    const router = useRouter();
    const { user, isAuthenticated, hasHydrated } = useAuthStore();

    // 'guest' page (e.g. /auth) never needs to check profile/approval status —
    // it only cares whether the person is logged in or not.
    const needsProfileCheck = pageType !== 'guest';
    const { isComplete, isLoading } = useProfileCompletion(needsProfileCheck && isAuthenticated);

    let redirectTo = null;
    const stillChecking = !hasHydrated || (needsProfileCheck && isAuthenticated && isLoading);

    if (!stillChecking) {
        if (pageType === 'guest') {
            if (isAuthenticated) redirectTo = '/';
        } else if (!isAuthenticated) {
            redirectTo = '/auth';
        } else if (pageType === 'onboarding') {
            if (isComplete) redirectTo = user.status === 'APPROVED' ? '/' : '/pending-approval';
        } else if (pageType === 'pendingApproval') {
            if (!isComplete) redirectTo = '/onboarding';
            else if (user.status === 'APPROVED') redirectTo = '/';
        } else {
            if (!isComplete) redirectTo = '/onboarding';
            else if (user.status !== 'APPROVED') redirectTo = '/pending-approval';
        }
    }

    useEffect(() => {
        if (redirectTo) router.replace(redirectTo);
    }, [redirectTo]);

    return { isChecking: stillChecking || !!redirectTo };
};