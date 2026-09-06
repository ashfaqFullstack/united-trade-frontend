'use client';

import UserMenu from '../layout/UserMenu';

export default function DashboardHeader() {
    return (
        <header className="sticky top-0 z-50 h-20 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
            <div className="flex h-full items-center justify-between px-5 sm:px-7">

                {/* Right */}
                <div className="ml-4 flex justify-end items-end gap-4 sm:gap-6">
                    {/* User */}
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}