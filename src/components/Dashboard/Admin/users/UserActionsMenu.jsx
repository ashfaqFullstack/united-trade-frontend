'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiUser, FiPackage, FiShoppingBag, FiSlash, FiCheckCircle } from 'react-icons/fi';

export default function UserActionsMenu({ user, onViewDetails, onSuspend, onUnblock }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isBlocked = user.status === 'BLOCKED';

    return (
        <div className="" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex h-8 w-8 items-center justify-center cursor-pointer rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
                <FiMoreVertical className="h-4 w-4 cursor-pointer " />
            </button>

            {open && (
                <div className="absolute right-0 top-9 z-1000 w-48 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl">
                    <Link href={`/dashboard/admin/users/${user.id}`}
                        type="button"
                        // onClick={() => {
                        //     setOpen(false);
                        //     onViewDetails(user);
                        // }}
                        className="flex w-full items-center cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                        <FiUser className="h-4 w-4" />
                        View Profile
                    </Link>

                    <div className="my-1 h-px bg-slate-100" />

                    {isBlocked ? (
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                onUnblock(user);
                            }}
                            className="flex w-full items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
                        >
                            <FiCheckCircle className="h-4 w-4" />
                            Reactivate Account
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                onSuspend(user);
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl cursor-pointer px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                        >
                            <FiSlash className="h-4 w-4" />
                            Suspend Account
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}