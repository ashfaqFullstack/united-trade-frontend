'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import DashboardHero from './Hero';
import DashboardStats from './Stats';
import { getDashboardRoutes } from '@/const/dashboardConfig';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { usePendingUsers } from '@/hooks/useAdmin';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === 'ADMIN';

    const { isComplete: isProfileComplete } = useProfileCompletion(!isAdmin);
    const { data: pendingData } = usePendingUsers({ page: 1, limit: 1 }, isAdmin);

    const dashboardRoutes = getDashboardRoutes({
        userName: user?.name,
        isProfileComplete,
        isAdmin,
        pendingCount: pendingData?.totalResults ?? 0,
    });

    const routeKey = dashboardRoutes[pathname] ? pathname : '/dashboard';
    const pageData = dashboardRoutes[routeKey];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
                <DashboardSidebar />
            </div>

            <div className="lg:pl-[280px]">
                <DashboardHeader />

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