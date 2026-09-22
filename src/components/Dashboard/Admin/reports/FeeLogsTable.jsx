'use client';

import { useState } from 'react';
import { useFeeLogs } from '@/hooks/useReports';
import Loading from '@/components/ui/Loading';
import Pagination from '@/components/layout/Pagination';

const TABS = [
    { key: '', label: 'All' },
    { key: 'TRADE_COMMISSION', label: 'Trade Commission' },
    { key: 'MONTHLY_FEE', label: 'Monthly Fee' },
];

const TYPE_STYLES = {
    TRADE_COMMISSION: 'bg-blue-50 text-blue-600',
    MONTHLY_FEE: 'bg-purple-50 text-purple-600',
};

const TYPE_LABELS = {
    TRADE_COMMISSION: 'Trade Commission',
    MONTHLY_FEE: 'Monthly Fee',
};

export default function FeeLogsTable() {
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading } = useFeeLogs({ type: type || undefined, page, limit: 10 });

    const logs = data?.results || [];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-bold text-slate-900">Fee & Commission Logs ({data?.totalResults ?? 0})</h3>

                <div className="flex gap-1 rounded-full bg-slate-100 p-1">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => {
                                setType(t.key);
                                setPage(1);
                            }}
                            className={`whitespace-nowrap cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${type === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : !logs.length ? (
                <p className="py-10 text-center text-sm text-slate-400">No logs found.</p>
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
                                <span
                                    className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_STYLES[log.type]}`}
                                >
                                    {TYPE_LABELS[log.type]}
                                </span>
                                <span className="font-semibold text-slate-800">${Number(log.amount).toLocaleString()}</span>
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