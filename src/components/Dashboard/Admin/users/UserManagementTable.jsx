'use client';

import { useState } from 'react';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import UserActionsMenu from './UserActionsMenu';
import UserDetailsModal from './UserDetailsModal';
import { useAllUsers, useBlockUser, useUnblockUser } from '@/hooks/useAdmin';
import Pagination from '@/components/layout/Pagination';
import Loading from '@/components/ui/Loading';
import AdminConfirmModal from '@/components/ui/AdminConfirmationModal';

const TABS = [
    { key: '', label: 'All' },
    { key: 'CUSTOMER', label: 'Customers' },
    { key: 'BUSINESS', label: 'Businesses' },
];

export default function UsersManagementTable() {
    const [role, setRole] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [detailsUser, setDetailsUser] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null); // { user, type: 'suspend' | 'unblock' }

    const { data, isLoading } = useAllUsers({ role: role || undefined, search: search || undefined, page, limit: 10 });
    const { mutate: block, isPending: blocking } = useBlockUser();
    const { mutate: unblock, isPending: unblocking } = useUnblockUser();

    const handleConfirm = () => {
        if (!confirmAction) return;
        const { user, type } = confirmAction;
        const mutate = type === 'suspend' ? block : unblock;
        mutate(user.id, { onSuccess: () => setConfirmAction(null) });
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Users Management</h2>
                    <p className="text-sm text-slate-500">Manage and monitor all platform users.</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px]">
                    <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users by name, email or ID..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="flex gap-1 rounded-full bg-slate-100 p-1">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => {
                                setRole(t.key);
                                setPage(1);
                            }}
                            className={`whitespace-nowrap cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition ${role === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className=" rounded-2xl  border border-slate-100 bg-white">
                {isLoading ? (
                    <Loading />
                ) : !data?.results?.length ? (
                    <p className="py-10 text-center text-sm text-slate-400">No users found.</p>
                ) : (
                    <>
                        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid">
                            <span>User</span>
                            <span>Type</span>
                            <span>Status</span>
                            <span>Joined</span>
                            <span></span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {data.results.map((u) => {
                                const displayName = u.businessProfile?.businessName || u.name;
                                const initials = displayName?.slice(0, 2)?.toUpperCase() || '?';

                                return (
                                    <div
                                        key={u.id}
                                        className="grid grid-cols-2 relative items-center gap-4 px-6 py-3.5 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                                                {initials}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                                                <p className="truncate text-xs text-slate-400">{u.email}</p>
                                            </div>
                                        </div>

                                        <span className="text-sm text-slate-500">{u.role}</span>

                                        <span
                                            className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${u.status === 'APPROVED'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : u.status === 'BLOCKED'
                                                    ? 'bg-red-50 text-red-500'
                                                    : u.status === 'REJECTED'
                                                        ? 'bg-slate-100 text-slate-500'
                                                        : 'bg-amber-50 text-amber-600'
                                                }`}
                                        >
                                            {u.status}
                                        </span>

                                        <span className="hidden text-sm text-slate-400 sm:block">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </span>

                                        <UserActionsMenu
                                            user={u}
                                            onViewDetails={setDetailsUser}
                                            onSuspend={(user) => setConfirmAction({ user, type: 'suspend' })}
                                            onUnblock={(user) => setConfirmAction({ user, type: 'unblock' })}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
                    </>
                )}
            </div>

            <UserDetailsModal open={!!detailsUser} onClose={() => setDetailsUser(null)} user={detailsUser} />

            <AdminConfirmModal
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={handleConfirm}
                title={confirmAction?.type === 'suspend' ? 'Suspend this account?' : 'Reactivate this account?'}
                description={
                    confirmAction?.type === 'suspend'
                        ? `${confirmAction?.user?.name} will no longer be able to log in or trade until reactivated.`
                        : `${confirmAction?.user?.name} will regain full access to their account.`
                }
                confirmText={confirmAction?.type === 'suspend' ? 'Yes, Suspend' : 'Yes, Reactivate'}
                isDanger={confirmAction?.type === 'suspend'}
                isLoading={blocking || unblocking}
            />
        </div>
    );
}