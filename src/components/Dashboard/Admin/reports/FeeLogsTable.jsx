
'use client';

import { formatMoney } from '@/lib/currency';
import { useState } from 'react';
import { useCommissionLogs } from '@/hooks/useReports';
import Loading from '@/components/ui/Loading';
import Pagination from '@/components/layout/Pagination';

export default function FeeLogsTable() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useCommissionLogs({ page, limit: 10 });

    const logs = data?.results || [];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-bold text-slate-900">Trade Commission Logs ({data?.totalResults ?? 0})</h3>
            </div>

            {isLoading ? (
                <Loading />
            ) : !logs.length ? (
                <p className="py-10 text-center text-sm text-slate-400">No commission logs found.</p>
            ) : (
                <>
                    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid">
                        <span>User</span>
                        <span>Type</span>
                        <span>Amount</span>
                        <span>Date</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <div key={log.id} className="grid grid-cols-2 gap-3 px-6 py-3.5 text-sm sm:grid-cols-[2fr_1fr_1fr_1fr]">
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-900">{log.user?.name}</p>
                                    <p className="truncate text-xs text-slate-400">{log.user?.email}</p>
                                </div>
                                <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                                    Trade Commission
                                </span>
                                <span className="font-semibold text-slate-800">{formatMoney(log.amount, 'USD')}</span>
                                <span className="hidden text-slate-400 sm:block">{new Date(log.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>

                    <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
                </>
            )}
        </div>
    );
}