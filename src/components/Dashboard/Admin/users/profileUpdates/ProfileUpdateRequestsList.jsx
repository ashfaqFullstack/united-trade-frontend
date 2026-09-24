'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronRight, FiClock } from 'react-icons/fi';
import Loading from '@/components/ui/Loading';
import { useProfileUpdateRequests } from '@/hooks/useAdmin';

const TABS = [
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
];

export default function ProfileUpdateRequestsList() {
    const [status, setStatus] = useState('PENDING');
    const router = useRouter();
    const { data: requests, isLoading } = useProfileUpdateRequests(status);

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Profile Update Requests</h2>
                <p className="text-sm text-slate-500">Review changes users have requested to their profile.</p>
            </div>

            <div className="flex gap-1 rounded-full bg-slate-100 p-1" style={{ width: 'fit-content' }}>
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setStatus(t.key)}
                        className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition ${status === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                {isLoading ? (
                    <Loading />
                ) : !requests?.length ? (
                    <div className="py-10 text-center">
                        <FiClock className="mx-auto h-8 w-8 text-slate-300" />
                        <p className="mt-3 text-sm text-slate-400">No {status.toLowerCase()} requests.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {requests.map((r) => {
                            const displayName = r.user?.businessProfile?.businessName || r.user?.name;
                            return (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => router.push(`/dashboard/admin/profile-updates/${r.id}`)}
                                    className="flex w-full cursor-pointer items-center justify-between gap-3 px-6 py-4 text-left transition hover:bg-slate-50"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                                        <p className="text-xs text-slate-400">{r.user?.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-400">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </span>
                                        <FiChevronRight className="h-4 w-4 text-slate-300" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}