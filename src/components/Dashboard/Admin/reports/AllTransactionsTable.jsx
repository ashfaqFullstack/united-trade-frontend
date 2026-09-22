'use client';

import { useState } from 'react';
import { useAllTransactions } from '@/hooks/useReports';
import Pagination from '@/components/layout/Pagination';
import Loading from '@/components/ui/Loading';

export default function AllTransactionsTable() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useAllTransactions({ page, limit: 10 });

    if (isLoading) return <Loading />;

    const transactions = data?.results || [];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-bold text-slate-900">All Transactions ({data?.totalResults ?? 0})</h3>
            </div>

            {!transactions.length ? (
                <p className="py-10 text-center text-sm text-slate-400">No transactions yet.</p>
            ) : (
                <>
                    <div className="hidden grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid">
                        <span>Sender</span>
                        <span>Receiver</span>
                        <span>Amount</span>
                        <span>Commission</span>
                        <span>Date</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {transactions.map((t) => (
                            <div
                                key={t.id}
                                className="grid grid-cols-2 gap-3 px-6 py-3.5 text-sm sm:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr]"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-900">{t.sender?.name}</p>
                                    <p className="truncate text-xs text-slate-400">{t.sender?.email}</p>
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-900">{t.receiver?.name}</p>
                                    <p className="truncate text-xs text-slate-400">{t.receiver?.email}</p>
                                </div>
                                <span className="font-semibold text-slate-800">${Number(t.amount).toLocaleString()}</span>
                                <span className="text-slate-500">
                                    ${(Number(t.commissionBuyer) + Number(t.commissionSeller)).toLocaleString()}
                                </span>
                                <span className="hidden text-slate-400 sm:block">
                                    {new Date(t.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
                </>
            )}
        </div>
    );
}