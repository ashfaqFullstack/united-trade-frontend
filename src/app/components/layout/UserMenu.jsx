'use client';

import { useState, useRef, useEffect } from 'react';
import { LuUser, LuLogOut, LuChevronDown } from 'react-icons/lu';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/hooks/useAuth';

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const user = useAuthStore((state) => state.user);
    const { mutate: logout, isPending } = useLogout();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 transition hover:bg-slate-50"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                    <LuUser className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                <LuChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    <button
                        type="button"
                        onClick={() => logout()}
                        disabled={isPending}
                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 disabled:opacity-60"
                    >
                        <LuLogOut className="h-4 w-4" />
                        {isPending ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            )}
        </div>
    );
}