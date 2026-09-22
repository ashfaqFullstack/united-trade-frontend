'use client';

import { useAuthStore } from '@/store/useAuthStore';
import AdminOverview from '@/components/Dashboard/Admin/AdminOverview';
import UserDashboardOverview from '@/components/Dashboard/UserDashboardOverview';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    if (user?.role === 'ADMIN') {
        return <AdminOverview />;
    }

    return <UserDashboardOverview />;
}