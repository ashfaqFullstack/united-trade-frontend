"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import UserMenu from "../layout/UserMenu";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Why Barter", href: "/" },
    { label: "Safety", href: "/" },
    { label: "FAQ", href: "/" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState(navLinks[0].label);
    const user = useAuthStore((state) => state.user);

    const handleLinkClick = (label) => {
        setActiveLink(label);
        setIsOpen(false);
    };

    return (
        <header className="relative z-50 w-full bg-white border-b border-slate-200 shadow-sm">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
                        <ArrowsIcon className="h-4 w-4" />
                    </span>
                    <span className="text-xl font-semibold text-slate-900">United Trade</span>
                </Link>

                {/* Desktop links with sliding active pill */}
                <ul className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <li key={link.label} className="relative">
                            <Link
                                href={link.href}
                                onClick={() => handleLinkClick(link.label)}
                                className={`relative z-10 block px-4 py-2 text-sm font-medium transition-colors ${activeLink === link.label
                                    ? "text-indigo-600"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                {link.label}
                            </Link>
                            {activeLink === link.label && (
                                <motion.span
                                    layoutId="activeNavPill"
                                    className="absolute inset-0 rounded-full bg-indigo-50"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </li>
                    ))}
                </ul>

                {/* Right actions */}
                {
                    user ? <UserMenu /> : (
                        <div className="hidden items-center gap-6 md:flex">
                            {/* <Link href="/auth" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                        Login
                        </Link> */}

                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Link
                                    href="/auth"
                                    className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm"
                                >
                                    Get Started
                                </Link>
                            </motion.div>
                        </div>
                    )}

                {/* Animated hamburger / close icon */}
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="relative z-50 cursor-pointer flex h-8 w-8 flex-col items-center justify-center gap-[6px] md:hidden"
                    aria-label="Toggle menu"
                >
                    <motion.span
                        className="h-[2px] w-6 bg-slate-800"
                        animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                    <motion.span
                        className="h-[2px] w-6 bg-slate-800"
                        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.span
                        className="h-[2px] w-6 bg-slate-800"
                        animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                </button>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 top-[64px] z-40 bg-slate-900/20 md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* panel */}
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute left-0 right-0 top-full z-50 overflow-hidden border-t border-slate-100 bg-white shadow-lg md:hidden"
                        >
                            <motion.ul
                                initial="hidden"
                                animate="show"
                                variants={{
                                    hidden: {},
                                    show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
                                }}
                                className="flex flex-col gap-1 px-6 py-4"
                            >
                                {navLinks.map((link) => (
                                    <motion.li
                                        key={link.label}
                                        variants={{
                                            hidden: { opacity: 0, x: -12 },
                                            show: { opacity: 1, x: 0 },
                                        }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => handleLinkClick(link.label)}
                                            className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${activeLink === link.label
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.li>
                                ))}

                                {
                                    user ?
                                        <UserMenu /> :
                                        <motion.li
                                            variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                                        >
                                            <Link
                                                href="/auth"
                                                onClick={() => setIsOpen(false)}
                                                className="mt-1 block rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white"
                                            >
                                                Get Started
                                            </Link>
                                        </motion.li>
                                }
                            </motion.ul>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}

function ArrowsIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M17 2l4 4-4 4M3 12v-2a4 4 0 014-4h14M7 22l-4-4 4-4M21 12v2a4 4 0 01-4 4H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}