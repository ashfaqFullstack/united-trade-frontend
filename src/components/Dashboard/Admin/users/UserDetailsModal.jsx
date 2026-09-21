'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiMail, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';

const TABS = ['Overview', 'Listings', 'Orders', 'Activity'];

export default function UserDetailsModal({ open, onClose, user }) {
    const [tab, setTab] = useState('Overview');

    if (!user) return null;

    const profile = user.role === 'BUSINESS' ? user.businessProfile : user.customerProfile;
    const displayName = profile?.businessName || user.name;
    const initials = displayName?.slice(0, 2)?.toUpperCase() || '?';

    return (
        <div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
                        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 10 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute right-4 top-4 flex h-8 w-8 items-center cursor-pointer justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                            >
                                <FiX className="h-4 w-4" />
                            </button>

                            <div className="flex items-center gap-3">
                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
                                    {initials}
                                </span>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">{user.role}</span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${user.status === 'APPROVED'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : user.status === 'BLOCKED'
                                                    ? 'bg-red-50 text-red-500'
                                                    : 'bg-amber-50 text-amber-600'
                                                }`}
                                        >
                                            {user.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex gap-1 rounded-full bg-slate-100 p-1">
                                {TABS.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setTab(t)}
                                        className={`flex-1 rounded-full cursor-pointer py-1.5 text-xs font-semibold transition ${tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-5">
                                {tab === 'Overview' && (
                                    <dl className="space-y-3 text-sm">
                                        <Row icon={FiMail} label="Email" value={user.email} />
                                        <Row icon={FiPhone} label="Phone" value={profile?.phone} />
                                        <Row icon={FiGlobe} label="Country" value={user.country || profile?.country} />
                                        <Row icon={FiMapPin} label="City" value={profile?.city} />
                                        <Row label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
                                    </dl>
                                )}

                                {tab !== 'Overview' && (
                                    <p className="py-10 text-center text-sm text-slate-400">
                                        {tab} view coming soon.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Row({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="flex items-center gap-2 text-slate-400">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
            </span>
            <span className="font-medium text-slate-800">{value || '—'}</span>
        </div>
    );
}