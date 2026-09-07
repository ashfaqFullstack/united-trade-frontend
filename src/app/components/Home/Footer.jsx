'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    BsArrowRight
} from 'react-icons/bs';
import { footerLinks, socialLinks } from '@/const/const';
import { useAuthStore } from '@/store/useAuthStore';

export default function Footer() {
    const user = useAuthStore((state) => state.user);



    return (
        <footer className="relative overflow-hidden bg-white">
            {/* =====================================================
                CTA SECTION
            ====================================================== */}
            <section className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400">
                {/* Decorative shapes */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {/* Left purple shape */}
                    <div className="absolute -left-20 -top-32 h-[260px] w-[430px] -rotate-[38deg] rounded-[45%] bg-purple-500/40 blur-[1px]" />

                    <div className="absolute -left-32 -top-20 h-[180px] w-[330px] -rotate-[38deg] rounded-[45%] bg-indigo-300/20" />

                    {/* Right blue shape */}
                    <div className="absolute -right-32 -top-20 h-[260px] w-[430px] rotate-[38deg] rounded-[45%] bg-sky-300/30" />

                    <div className="absolute -bottom-32 left-1/2 h-[180px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
                </div>

                <div className="relative mx-auto flex min-h-[190px] max-w-7xl flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[210px] sm:px-8
                ">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[34px]">
                            Ready to Trade Differently?
                        </h2>

                        <p className="mt-2 text-[10px] font-medium text-white/80 sm:text-xs">
                            Stop letting unused things sit around. Find them a
                            new purpose.
                        </p>

                        {
                            !user &&
                            <Link
                                href="/auth"
                                className="group mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[10px] font-semibold text-slate-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:px-6 sm:py-3 sm:text-[11px]"
                            >
                                Create Your Account

                                <BsArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        }
                    </motion.div>
                </div>
            </section>

            {/* =====================================================
                FOOTER CONTENT
            ====================================================== */}

            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-10 lg:px-12">
                    <div className="flex flex-col items-center gap-7 lg:flex-row lg:items-start lg:justify-between">
                        {/* LOGO */}
                        <div className="flex flex-col items-center lg:items-start">
                            <Link
                                href="/"
                                className="group flex items-center gap-2"
                            >
                                {/* Logo mark */}
                                <div className="relative flex h-7 w-7 items-center justify-center">
                                    <div className="absolute h-5 w-5 rotate-45 rounded-[5px] bg-gradient-to-br from-blue-400 to-indigo-500 transition-transform duration-300 group-hover:rotate-[55deg]" />

                                    <div className="relative z-10 text-white">
                                        <BsArrowRight
                                            className="h-4 w-4 -rotate-45"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                </div>

                                <span className="text-lg font-bold tracking-tight text-[#142b50]">
                                    United Trade
                                </span>
                            </Link>

                            <p className="mt-0.5 text-[8px] font-medium text-slate-400">
                                More value. Less waste.
                            </p>
                        </div>

                        {/* NAVIGATION */}
                        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:mt-2">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-blue-500 "
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* SOCIAL ICONS */}
                        <div className="flex items-center gap-2 lg:mt-1">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;

                                return (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:text-white"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* COPYRIGHT */}
                    <div className="mt-7 border-t border-slate-100 pt-5 text-center">
                        <p className="font-medium text-slate-400 text-sm">
                            © 2026 United Trade. All rights reserved.
                        </p>
                    </div>
                </div>
            </section>
        </footer>
    );
}