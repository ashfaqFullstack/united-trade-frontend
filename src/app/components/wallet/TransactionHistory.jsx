'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyTransactions } from '@/hooks/useTransaction';
import Pagination from '../layout/Pagination';
import TransactionListItem from './TransactionListItem';
import Loading from '../ui/Loading';

const TABS = [
    { key: 'all', label: 'All' },
    { key: 'received', label: 'Received' },
    { key: 'sent', label: 'Sent' },
    { key: 'topup', label: 'Top Up', disabled: true },
    { key: 'withdraw', label: 'Withdraw', disabled: true },
];

export default function TransactionHistory() {
    const [tab, setTab] = useState('all');
    const [page, setPage] = useState(1);
    const user = useAuthStore((state) => state.user);
    const { data, isLoading } = useMyTransactions({ page, limit: 10 });

    const transactions = (data?.results || []).filter((t) => {
        if (tab === 'all') return true;
        const isSender = t.senderId === user?.id;
        if (tab === 'received') return !isSender;
        if (tab === 'sent') return isSender;
        return false;
    });

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>

            <div className="flex gap-2 overflow-x-auto rounded-full bg-slate-100 p-1">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        disabled={t.disabled}
                        onClick={() => setTab(t.key)}
                        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${tab === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white px-4">
                {isLoading ? (
                    <Loading />
                ) : !transactions.length ? (
                    <p className="py-8 text-center text-sm text-slate-400">No transactions found.</p>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {transactions.map((t) => {
                            const isSender = t.senderId === user?.id;
                            return (
                                <TransactionListItem
                                    key={t.id}
                                    type={isSender ? 'sent' : 'received'}
                                    title={isSender ? 'Money Sent' : 'Money Received'}
                                    subtitle={isSender ? `To ${t.receiver.name}` : `From ${t.sender.name}`}
                                    amount={t.amount}
                                    date={new Date(t.createdAt).toLocaleDateString()}
                                />
                            );
                        })}
                    </div>
                )}
                {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
            </div>
        </div>
    );
}