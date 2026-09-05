'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import {
    FiShield,
    FiStar,
    FiMessageCircle,
    FiClock,
} from 'react-icons/fi';

import { BsCheckLg } from 'react-icons/bs';
import { people, trustCards } from '@/const/const';

export default function TrustSection() {
    return (
        <section className="relative isolate overflow-hidden bg-[#f8fbff]">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[10%] top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-blue-100/30 blur-[100px]" />

                <div className="absolute right-[10%] top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-indigo-100/20 blur-[100px]" />
            </div>

            <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-5 py-16 sm:px-8 md:py-20 lg:flex-row lg:gap-10 lg:px-12 lg:py-20">
                {/* =====================================================
                    LEFT VISUAL
                ====================================================== */}
                <div className="relative h-[330px] w-full max-w-[470px] shrink-0 sm:h-[380px] lg:h-[400px] lg:w-[43%]">
                    {/* Outer soft glow */}
                    <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl sm:h-[310px] sm:w-[310px]" />

                    {/* =================================================
                        ORBIT LINES
                    ================================================== */}

                    {/* Horizontal curved-ish orbit */}
                    <div className="absolute left-1/2 top-1/2 h-[190px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-blue-200/50" />

                    {/* Vertical orbit */}
                    <div className="absolute left-1/2 top-1/2 h-[330px] w-[180px] -translate-x-1/2 -translate-y-1/2 rotate-[35deg] rounded-[50%] border border-blue-200/40" />

                    {/* Second diagonal orbit */}
                    <div className="absolute left-1/2 top-1/2 h-[320px] w-[180px] -translate-x-1/2 -translate-y-1/2 -rotate-[35deg] rounded-[50%] border border-blue-200/35" />

                    {/* Small orbit dots */}
                    <span className="absolute left-[20%] top-[19%] h-1.5 w-1.5 rounded-full bg-blue-300" />

                    <span className="absolute right-[18%] top-[21%] h-1.5 w-1.5 rounded-full bg-blue-300" />

                    <span className="absolute bottom-[20%] left-[22%] h-1.5 w-1.5 rounded-full bg-blue-300" />

                    <span className="absolute bottom-[18%] right-[20%] h-1.5 w-1.5 rounded-full bg-blue-300" />

                    <span className="absolute left-1/2 top-[5%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-300" />

                    {/* =================================================
                        PEOPLE
                    ================================================== */}

                    {people.map((person, index) => (
                        <motion.div
                            key={person.src}
                            className={`absolute ${person.position} z-20 h-14 w-14 overflow-hidden rounded-full border-[3px] border-white bg-white shadow-[0_8px_25px_rgba(40,80,140,0.16)] sm:h-16 sm:w-16`}
                            animate={{
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 4 + index * 0.4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: index * 0.3,
                            }}
                        >
                            <Image
                                src={person.src}
                                alt=""
                                fill
                                sizes="64px"
                                quality={100}
                                className="object-cover"
                            />
                        </motion.div>
                    ))}

                    {/* =================================================
                        SMALL FLOATING TRADE ICONS
                    ================================================== */}

                    {/* Top left */}
                    <motion.div
                        className="absolute left-[21%] top-[20%] z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white bg-white shadow-md"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <FiShield className="h-4 w-4 text-blue-400" />
                    </motion.div>

                    {/* Top right */}
                    <motion.div
                        className="absolute right-[20%] top-[20%] z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white bg-white shadow-md"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.5,
                        }}
                    >
                        <FiStar className="h-4 w-4 text-purple-400" />
                    </motion.div>

                    {/* Bottom left */}
                    <motion.div
                        className="absolute bottom-[20%] left-[18%] z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white bg-white shadow-md"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.8,
                        }}
                    >
                        <FiMessageCircle className="h-4 w-4 text-orange-400" />
                    </motion.div>

                    {/* Bottom right */}
                    <motion.div
                        className="absolute bottom-[20%] right-[18%] z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white bg-white shadow-md"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                    >
                        <FiClock className="h-4 w-4 text-cyan-400" />
                    </motion.div>

                    {/* =================================================
                        CENTRAL SHIELD
                    ================================================== */}

                    <motion.div
                        className="absolute left-1/2 top-1/2 z-30 flex h-28 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-32 sm:w-28"
                        animate={{
                            y: ['-50%', '-53%', '-50%'],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        {/* Glow */}
                        <div className="absolute inset-[-25px] rounded-full bg-blue-400/20 blur-2xl" />

                        {/* Shield shape */}
                        <div
                            className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 shadow-[0_15px_40px_rgba(59,130,246,0.35)]"
                            style={{
                                clipPath:
                                    'polygon(50% 0%, 90% 16%, 90% 58%, 78% 78%, 50% 100%, 22% 78%, 10% 58%, 10% 16%)',
                            }}
                        >
                            <BsCheckLg
                                className="h-12 w-12 text-white sm:h-14 sm:w-14"
                                strokeWidth={1.5}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* =====================================================
                    RIGHT CONTENT
                ====================================================== */}

                <div className="relative z-10 w-full lg:w-[57%]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <span className="mb-3 inline-flex rounded-full bg-blue-100/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-wide text-blue-600 sm:text-[10px]">
                            Your trust matters
                        </span>

                        {/* Heading */}
                        <h2 className="text-3xl font-bold tracking-tight text-[#12284f] sm:text-4xl">
                            Trade With Confidence
                        </h2>

                        {/* Cards */}
                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {trustCards.map((card, index) => {
                                const Icon = card.icon;

                                return (
                                    <motion.div
                                        key={card.title}
                                        initial={{
                                            opacity: 0,
                                            y: 15,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        viewport={{
                                            once: true,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.08,
                                        }}
                                        className="group flex min-h-[82px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3.5 py-3 shadow-[0_5px_20px_rgba(50,80,130,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(50,80,130,0.1)]"
                                    >
                                        {/* Icon */}
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${card.iconBg}`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 ${card.iconColor}`}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0">
                                            <h3 className="text-[13px] font-semibold text-[#18315a]">
                                                {card.title}
                                            </h3>

                                            <p className="mt-1 text-[10px] leading-[1.45] text-slate-400 sm:text-[11px]">
                                                {card.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}