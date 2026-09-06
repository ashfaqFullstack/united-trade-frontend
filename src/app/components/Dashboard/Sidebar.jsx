'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowRight, FiRepeat } from 'react-icons/fi';
import { sidebarItems } from '@/const/dashboardConfig';


export default function DashboardSidebar({ isOpen, onClose }) {
    const pathname = usePathname();

    return (
        <aside className={`fixed inset-y-0 left-0 z-[60] w-[280px] shrink-0 border-r border-slate-100 bg-white transition-transform duration-300 ease-out lg:static lg:z-auto lg:block lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="sticky top-0 flex h-screen flex-col px-5 py-6">

                {/* Logo */}
                <Link
                    href="/"
                    className="mb-10 flex items-center gap-3 px-2"
                >
                    <span className="text-[25px] font-extrabold tracking-tight text-slate-900">
                        United Trade
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            pathname === item.href ||
                            (item.href !== '/dashboard' &&
                                pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative block"
                                onClick={onClose}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 380,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                <div
                                    className={`
                                        relative z-10 flex items-center gap-5
                                        rounded-xl px-4 py-3.5
                                        transition-colors duration-200
                                        ${isActive
                                            ? 'text-blue-600'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }
                                    `}
                                >
                                    <Icon className="h-[21px] w-[21px] shrink-0" />

                                    <span className="text-[15px] font-medium">
                                        {item.label}
                                    </span>

                                    {item.badge && (
                                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom CTA */}
                <div className="mt-auto px-1">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5">

                        {/* Decorative glow */}
                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-200/30 blur-2xl" />

                        <motion.div
                            animate={{
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25"
                        >
                            <FiRepeat className="h-10 w-10 text-white" />

                            <span className="absolute inset-[-7px] rounded-full border border-blue-200/70" />
                        </motion.div>

                        <h3 className="relative text-[18px] font-bold leading-tight text-slate-900">
                            More Trades,
                            <br />
                            More Value
                        </h3>

                        <p className="relative mt-2 text-[13px] leading-5 text-slate-600">
                            Complete your profile to unlock the full Barter
                            experience.
                        </p>

                        <Link
                            href="/dashboard/profile"
                            className="group relative mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-[13px] font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Complete Profile

                            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}