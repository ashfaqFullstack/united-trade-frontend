'use client';

import { useAuthStore } from '@/store/useAuthStore';
import ProfileSummaryCard from '@/components/Dashboard/ProfileSummaryCard';
import AdminOverview from '@/components/Dashboard/Admin/AdminOverview';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    if (user?.role === 'ADMIN') {
        return <AdminOverview />;
    }

    return <ProfileSummaryCard />;
}