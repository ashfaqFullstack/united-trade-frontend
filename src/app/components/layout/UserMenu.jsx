'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    LuUser,
    LuLogOut,
    LuChevronDown,
    LuLayoutDashboard,
    LuHouse,
} from 'react-icons/lu';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/hooks/useAuth';

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const pathname = usePathname();

    const user = useAuthStore((state) => state.user);
    const { mutate: logout, isPending } = useLogout();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    if (!user) return null;

    const isDashboard = pathname === '/dashboard';

    const navigationLink = isDashboard ? '/' : '/dashboard';
    const navigationTitle = isDashboard ? 'Home' : 'Dashboard';
    const NavigationIcon = isDashboard
        ? LuHouse
        : LuLayoutDashboard;

    return (
        <div className="relative" ref={menuRef}>
            {/* User Button */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 transition hover:bg-slate-50"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                    <LuUser className="h-4 w-4" />
                </span>

                <span className="text-sm font-medium text-slate-700">
                    {user.name}
                </span>

                <LuChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50">

                    {/* Dynamic Home / Dashboard Link */}
                    <Link
                        href={navigationLink}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <NavigationIcon className="h-4 w-4" />
                        </span>

                        {navigationTitle}
                    </Link>

                    {/* Profile */}
                    <Link
                        href="/dashboard/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                            <LuUser className="h-4 w-4" />
                        </span>

                        Profile
                    </Link>

                    {/* Divider */}
                    <div className="my-1.5 h-px bg-slate-100" />

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={() => logout()}
                        disabled={isPending}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                            <LuLogOut className="h-4 w-4" />
                        </span>

                        {isPending ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            )}
        </div>
    );
}