'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyTransactions } from '@/hooks/useTransaction';
import TransactionListItem from './TransactionListItem';
import Loading from '../ui/Loading';

export default function TransactionHistoryPreview({ limit = 3 }) {
    const user = useAuthStore((state) => state.user);
    const { data, isLoading } = useMyTransactions({ page: 1, limit });

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
            </div>

            {isLoading ? (
                <Loading />
            ) : !data?.results?.length ? (
                <p className="py-4 text-center text-xs text-slate-400">No transactions yet.</p>
            ) : (
                <div className="divide-y divide-slate-100">
                    {data.results.map((t) => {
                        const isSender = t.senderId === user?.id;
                        return (
                            <TransactionListItem
                                key={t.id}
                                type={isSender ? 'sent' : 'received'}
                                title={isSender ? `Money Sent` : `Money Received`}
                                subtitle={isSender ? `To ${t.receiver.name}` : `From ${t.sender.name}`}
                                amount={t.amount}
                                date={new Date(t.createdAt).toLocaleDateString()}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}