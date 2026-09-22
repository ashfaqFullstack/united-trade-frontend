'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FiBriefcase, FiClipboard, FiDollarSign, FiList, FiRepeat } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserDashboardSummary, useUserSalesChart } from '@/hooks/useReports';
import Loading from '@/components/ui/Loading';

const PERIODS = [
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 },
];

function formatAmount(value, currency) {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency || 'USD',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

function StatCard({ label, value, icon: Icon, tone }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                    <Icon className="h-5 w-5" />
                </span>
            </div>
        </div>
    );
}

function ChartTooltip({ active, payload, label, currency }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{formatAmount(payload[0].value, currency)}</p>
            <p className="text-xs text-slate-400">{payload[0].payload.orders || 0} orders</p>
        </div>
    );
}

export default function UserDashboardOverview() {
    const user = useAuthStore((state) => state.user);
    const [period, setPeriod] = useState(7);
    const isBusiness = user?.role === 'BUSINESS';
    const { data: summary, isLoading: summaryLoading } = useUserDashboardSummary(!!user);
    const { data: chartResponse, isLoading: chartLoading } = useUserSalesChart(period, !!user);
    const currency = chartResponse?.currency || 'USD';
    const chartData = (chartResponse?.data || []).map((item) => ({
        ...item,
        label: new Date(`${item.date}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }),
    }));

    if (summaryLoading) return <Loading />;

    const stats = [
        { label: 'Total orders', value: Number(summary?.totalOrders || 0).toLocaleString(), icon: FiClipboard, tone: 'bg-blue-50 text-blue-600' },
        { label: 'Barter offers', value: Number(summary?.totalBarterOffers || 0).toLocaleString(), icon: FiRepeat, tone: 'bg-amber-50 text-amber-600' },
        { label: 'Active listings', value: Number(summary?.totalListings || 0).toLocaleString(), icon: FiList, tone: 'bg-emerald-50 text-emerald-600' },
    ];

    if (isBusiness) {
        stats.push({
            label: 'Total sales',
            value: formatAmount(summary?.totalSales, currency),
            icon: FiDollarSign,
            tone: 'bg-indigo-50 text-indigo-600',
        });
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            {isBusiness ? <FiBriefcase className="h-4 w-4 text-blue-600" /> : <FiDollarSign className="h-4 w-4 text-blue-600" />}
                            <h2 className="text-base font-bold text-slate-900">{isBusiness ? 'Sales overview' : 'Spending overview'}</h2>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{isBusiness ? 'Completed seller orders' : 'Your purchases over time'}</p>
                    </div>
                    <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                        {PERIODS.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setPeriod(item.value)}
                                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition ${period === item.value ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {chartLoading ? (
                    <div className="flex h-64 items-center justify-center"><Loading /></div>
                ) : chartData.length === 0 ? (
                    <div className="flex h-64 items-center justify-center text-sm text-slate-400">No activity for this period.</div>
                ) : (
                    <div className="mt-5 h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="userSalesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${currency} ${value}`} />
                                <Tooltip content={<ChartTooltip currency={currency} />} />
                                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} fill="url(#userSalesGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>
        </div>
    );
}
