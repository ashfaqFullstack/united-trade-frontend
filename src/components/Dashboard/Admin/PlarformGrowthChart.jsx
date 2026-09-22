'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSalesChart } from '@/hooks/useReports';
import Loading from '@/components/ui/Loading';

const RANGES = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
];

export default function PlatformGrowthChart() {
    const [days, setDays] = useState(7);
    const { data, isLoading } = useSalesChart(days);

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Platform Growth</h3>
                    <p className="text-xs text-slate-400">Revenue &amp; trade volume over time</p>
                </div>
                <div className="flex gap-1 rounded-full bg-slate-100 p-1">
                    {RANGES.map((r) => (
                        <button
                            key={r.value}
                            type="button"
                            onClick={() => setDays(r.value)}
                            className={`rounded-full px-3 cursor-pointer py-1 text-xs font-semibold transition ${days === r.value ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : (
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12 }}
                                formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Trade Volume']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#revenueGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}