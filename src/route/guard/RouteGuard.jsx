'use client';

import { useRouteGuard } from '@/hooks/useRouteGuard';

export default function RouteGuard({ type = 'protected', children }) {
    const { isChecking } = useRouteGuard(type);

    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F4F6FF]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    return children;
}