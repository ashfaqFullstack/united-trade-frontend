'use client';

import { usePendingUsers } from '@/hooks/useAdmin';
import { FiClock, FiMail, FiGlobe } from 'react-icons/fi';

export default function AdminPendingUsers() {
    const { data, isLoading } = usePendingUsers({ page: 1, limit: 20 });

    if (isLoading) {
        return <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-400">Loading pending users...</div>;
    }

    const users = data?.results || [];

    if (!users.length) {
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
                <FiClock className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-500">No pending approvals right now.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-base font-bold text-slate-900">Pending Approvals ({data.totalResults})</h3>
            </div>

            <div className="divide-y divide-slate-100">
                {users.map((u) => (
                    <div key={u.id} className="flex items-center justify-between px-6 py-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                {u.businessProfile?.businessName || u.name}
                            </p>
                            <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><FiMail className="h-3.5 w-3.5" />{u.email}</span>
                                {u.country && <span className="flex items-center gap-1"><FiGlobe className="h-3.5 w-3.5" />{u.country}</span>}
                            </div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${u.role === 'BUSINESS' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                            {u.role}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}