'use client';

import Link from 'next/link';
import { FiUsers, FiTag, FiRepeat, FiDollarSign, FiArrowRight, FiClock } from 'react-icons/fi';
import { useDashboardStats } from '@/hooks/useReports';
import { usePendingUsers } from '@/hooks/useAdmin';
import Loading from '@/components/ui/Loading';
import PlatformGrowthChart from './PlarformGrowthChart';

const STAT_CARDS = [
    { key: 'totalUsers', label: 'Total Users', icon: FiUsers, color: 'bg-blue-50 text-blue-600' },
    { key: 'totalListings', label: 'Total Listings', icon: FiTag, color: 'bg-purple-50 text-purple-600' },
    { key: 'totalTransactions', label: 'Total Transactions', icon: FiRepeat, color: 'bg-amber-50 text-amber-600' },
    { key: 'companyBalance', label: 'Company Balance', icon: FiDollarSign, color: 'bg-emerald-50 text-emerald-600', isCurrency: true },
];

const QUICK_ACTIONS = [
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: FiUsers },
    // { label: 'Manage Listings', href: '/listings', icon: FiTag },
    { label: 'View Transactions', href: '/dashboard/admin/reports', icon: FiRepeat },
    // { label: 'View Barter Offers', href: '/dashboard/barter-offers/received', icon: FiRepeat },
];

export default function AdminOverview() {
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: pending, isLoading: pendingLoading } = usePendingUsers({ page: 1, limit: 5 });

    if (statsLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <PlatformGrowthChart />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STAT_CARDS.map((card) => (
                    <div key={card.key} className="rounded-2xl border border-slate-100 bg-white p-5">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                            <card.icon className="h-4.5 w-4.5" />
                        </span>
                        <p className="mt-3 text-xl font-bold text-slate-900">
                            {card.isCurrency ? '$' : ''}
                            {Number(stats?.[card.key] ?? 0).toLocaleString()}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 lg:col-span-2">
                    <h3 className="mb-4 text-sm font-bold text-slate-900">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {QUICK_ACTIONS.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/50"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                    <action.icon className="h-4 w-4" />
                                </span>
                                <span className="text-sm font-medium text-slate-700">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <FiClock className="h-4 w-4 text-amber-500" />
                            Pending Approvals
                        </h3>
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                            {stats?.pendingUsers ?? 0}
                        </span>
                    </div>

                    {pendingLoading ? (
                        <p className="text-xs text-slate-400">Loading...</p>
                    ) : !pending?.results?.length ? (
                        <p className="text-xs text-slate-400">No pending approvals right now.</p>
                    ) : (
                        <div className="space-y-3">
                            {pending.results.map((u) => (
                                <Link
                                    key={u.id}
                                    href={`/dashboard/admin/users/${u.id}`}
                                    className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm transition hover:bg-slate-50"
                                >
                                    <span className="truncate font-medium text-slate-700">
                                        {u.businessProfile?.businessName || u.name}
                                    </span>
                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                                        {u.role}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Link
                        href="/dashboard/admin/users"
                        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        View All
                        <FiArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}