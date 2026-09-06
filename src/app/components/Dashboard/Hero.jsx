'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    FiArrowRight,
    FiCheck,
    FiStar,
} from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';

const containerVariants = {
    hidden: {
        opacity: 0,
    },

    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 15,
    },

    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function DashboardHero({ data }) {
    const user = useAuthStore((state) => state.user);
    const Icon = data.icon;
    const BadgeIcon = data.badgeIcon;

    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="
                relative overflow-hidden
                rounded-[22px]
                border border-white/70
                bg-gradient-to-r
                from-blue-50
                via-white
                to-indigo-100
                px-6 py-7
                shadow-sm
                sm:px-8
                lg:px-10
            "
        >
            {/* Background decorative elements */}

            <motion.div
                animate={{
                    x: [0, 20, 0],
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl"
            />

            <motion.div
                animate={{
                    x: [0, -15, 0],
                    y: [0, 10, 0],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl"
            />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}
                <div className="max-w-2xl">

                    {/* Badge */}
                    <motion.div variants={itemVariants}>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur">
                            <BadgeIcon className="h-3.5 w-3.5 text-blue-600" />

                            <span className="text-[11px] font-semibold text-slate-600">
                                {data.badge}
                            </span>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div variants={itemVariants}>
                        <p className="mb-1 text-sm font-medium text-blue-600">
                            {data.eyebrow}
                        </p>

                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-[34px]">
                            {data.title}
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-[15px]"
                    >
                        {data.description}
                    </motion.p>

                    {/* Progress */}
                    {typeof data.progress === 'number' && (
                        <motion.div
                            variants={itemVariants}
                            className="mt-6 max-w-[520px]"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">
                                    Profile completion
                                </span>

                                <span className="text-xs font-bold text-slate-800">
                                    {data.progress}%
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-blue-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${data.progress}%`,
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.4,
                                        ease: 'easeOut',
                                    }}
                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Action */}
                    {data.action && (
                        <motion.div
                            variants={itemVariants}
                            className="mt-6"
                        >
                            <Link
                                href={data.action.href}
                                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                {data.action.label}

                                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Right Visual */}
                <motion.div
                    variants={itemVariants}
                    className="relative hidden min-h-[150px] w-[300px] shrink-0 items-center justify-center lg:flex"
                >
                    {/* Orbit */}
                    <motion.div
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute h-40 w-40 rounded-full border border-blue-200/60"
                    >
                        <span className="absolute -right-1 top-1/2 h-2 w-2 rounded-full bg-indigo-500" />
                    </motion.div>

                    <motion.div
                        animate={{
                            rotate: -360,
                        }}
                        transition={{
                            duration: 24,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute h-56 w-56 rounded-full border border-indigo-200/40"
                    >
                        <span className="absolute left-1/2 top-0 h-2 w-2 rounded-full bg-blue-400" />
                    </motion.div>

                    {/* Main Icon */}
                    <motion.div
                        animate={{
                            y: [0, -8, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className={`
                            relative z-10
                            flex h-28 w-28
                            items-center justify-center
                            rounded-[30px]
                            bg-gradient-to-br
                            ${data.iconBg}
                            shadow-2xl
                        `}
                    >
                        <Icon className="h-12 w-12 text-white" />

                        <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg">
                            <FiCheck className="h-4 w-4 text-emerald-500" />
                        </div>
                    </motion.div>

                    {/* Floating card */}
                    <motion.div
                        animate={{
                            y: [0, 6, 0],
                            rotate: [0, 2, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute -right-2 top-3 rounded-xl border border-white bg-white/90 p-3 shadow-lg backdrop-blur"
                    >
                        <FiStar className="h-5 w-5 fill-amber-400 text-amber-400" />
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}