'use client';

import { useAuthStore } from '@/store/useAuthStore';
import AdminPendingUsers from '@/app/components/Dashboard/Admin/PendingUsers';
import ProfileSummaryCard from '@/app/components/Dashboard/ProfileSummaryCard';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    if (user?.role === 'ADMIN') {
        return <AdminPendingUsers />;
    }

    return <ProfileSummaryCard />;
}