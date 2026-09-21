'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardSidebar from '../Dashboard/Sidebar';
import DashboardHeader from '../Dashboard/Header';
import DashboardHero from '../Dashboard/Hero';
import DashboardStats from '../Dashboard/Stats';
import { getDashboardRoutes } from '@/const/dashboardConfig';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { usePendingUsers } from '@/hooks/useAdmin';
import PendingApprovalCard from '@/components/onboarding/PendingApproval';
import { useState } from 'react';
import { useMyWallet } from '@/hooks/useWallet';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === 'ADMIN';
    const { data: wallet } = useMyWallet(!isAdmin);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { isComplete: isProfileComplete } = useProfileCompletion(!isAdmin);
    const { data: pendingData } = usePendingUsers({ page: 1, limit: 1 }, isAdmin);

    if (!isAdmin && user && user.status !== 'APPROVED') {
        return <PendingApprovalCard />;
    }

    const dashboardRoutes = getDashboardRoutes({
        userName: user?.name,
        isProfileComplete,
        isAdmin,
        pendingCount: pendingData?.totalResults ?? 0,
        walletBalance: wallet?.balance ?? 0,
        creditLimit: wallet?.creditLimit ?? 0,
    });

    const routeKey = dashboardRoutes[pathname] ? pathname : '/dashboard';
    const pageData = dashboardRoutes[routeKey];

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] lg:grid lg:grid-cols-[280px_1fr]">
            <DashboardSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isAdmin={isAdmin}
            />

            {/* Mobile backdrop */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-[55] bg-slate-900/40 lg:hidden"
                />
            )}

            <div className="flex min-h-screen min-w-0 flex-col">
                <DashboardHeader
                    isSidebarOpen={isSidebarOpen}
                    onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
                />

                <main className="w-full flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                    {pathname === '/dashboard' && <DashboardHero key={routeKey} data={pageData} />}

                    <motion.div
                        key={`content-${routeKey}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
                        className="mt-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}