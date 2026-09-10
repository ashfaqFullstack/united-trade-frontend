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
import PendingApprovalCard from '@/app/components/onboarding/PendingApproval';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === 'ADMIN';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    const { isComplete: isProfileComplete } = useProfileCompletion(!isAdmin);
    const { data: pendingData } = usePendingUsers({ page: 1, limit: 1 }, isAdmin);

    // Customers/Businesses can't access the dashboard until their account
    // is approved — they only ever see the pending-approval screen here.
    if (!isAdmin && user && user.status !== 'APPROVED') {
        return <PendingApprovalCard />;
    }

    const dashboardRoutes = getDashboardRoutes({
        userName: user?.name,
        isProfileComplete,
        isAdmin,
        pendingCount: pendingData?.totalResults ?? 0,
    });

    const routeKey = dashboardRoutes[pathname] ? pathname : '/dashboard';
    const pageData = dashboardRoutes[routeKey];

    return (
        <div className="min-h-screen flex mx-auto relative  bg-[#f8fafc]">
            <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile backdrop */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-[55] bg-slate-900/40 lg:hidden"
                />
            )}

            <div className="">
                <DashboardHeader
                    isSidebarOpen={isSidebarOpen}
                    onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
                />

                <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                    <DashboardHero key={routeKey} data={pageData} />

                    {pageData.stats?.length > 0 && (
                        <div className="mt-6">
                            <DashboardStats stats={pageData.stats} />
                        </div>
                    )}

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