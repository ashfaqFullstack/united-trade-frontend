'use client';

import UserMenu from '../layout/UserMenu';
import { FiMenu, FiX } from 'react-icons/fi';

export default function DashboardHeader({ isSidebarOpen, onMenuClick }) {
    return (
        <header className="sticky top-0 z-50 h-20 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
            <div className="flex h-full items-center justify-between px-5 sm:px-7">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    className="inline-flex cursor-pointer h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
                >
                    {isSidebarOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
                </button>

                {/* Right */}
                <div className="ml-auto  flex items-end justify-end gap-4 sm:gap-6">
                    {/* User */}
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}