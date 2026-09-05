'use client';

import { bubbles } from '@/const/const';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BsArrowLeftRight } from 'react-icons/bs';



export default function BenefitsSection() {
    return (
        <section className="relative isolate overflow-hidden bg-[#f7faff]">
            {/* Soft background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[45%] top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/30 blur-[100px]" />

                <div className="absolute right-[-100px] top-[-100px] h-[350px] w-[350px] rounded-full bg-indigo-100/20 blur-[100px]" />
            </div>

            <div className="relative mx-auto flex flex-col md:flex-row min-h-[520px] w-full max-w-7xl items-center px-5 py-16 sm:px-8 md:min-h-[560px] lg:px-12 lg:py-20">
                {/* LEFT CONTENT */}
                <div className="relative z-20 w-full max-w-xl lg:w-[48%]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Small badge */}
                        <span className="mb-4 inline-flex items-center rounded-full bg-blue-100/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-wide text-blue-600 sm:text-[10px]">
                            More than just money
                        </span>

                        {/* Heading */}
                        <h2 className="max-w-[520px] font-bold leading-[1.12] tracking-tight text-[#12284f] text-2xl md:text-3xl lg:text-4xl">
                            Your money isn&apos;t the only
                            <br className="hidden sm:block" />
                            thing that has{' '}
                            <span className="text-blue-500">value.</span>
                        </h2>

                        {/* Description */}
                        <p className="mt-5 max-w-md text-sm leading-6 text-slate-500 sm:text-[15px]">
                            Your unused things, skills, knowledge and time
                            can all have value to someone else.
                        </p>
                    </motion.div>
                </div>

                {/* RIGHT VISUAL */}
                <div className="relative hidden h-[440px] w-[58%] lg:block">
                    {/* Connecting lines */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute left-[20%] top-[25%] h-px w-[55%] rotate-[20deg] bg-blue-200/40" />

                        <div className="absolute left-[18%] top-[45%] h-px w-[65%] -rotate-[10deg] bg-blue-200/40" />

                        <div className="absolute left-[30%] top-[20%] h-[65%] w-px rotate-[30deg] bg-blue-200/30" />

                        <div className="absolute left-[48%] top-[15%] h-[70%] w-px rotate-[55deg] bg-blue-200/30" />

                        <div className="absolute left-[45%] top-[42%] h-px w-[48%] rotate-[35deg] bg-blue-200/40" />

                        <div className="absolute left-[35%] top-[55%] h-px w-[55%] -rotate-[28deg] bg-blue-200/30" />
                    </div>

                    {/* Orbit glow */}
                    <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-2xl" />

                    {/* Bubbles */}
                    {bubbles.map((bubble, index) => {
                        const Icon = bubble.icon;

                        return (
                            <motion.div
                                key={index}
                                className={`absolute ${bubble.position} ${bubble.size} z-10 flex items-center justify-center rounded-full border border-white/80 ${bubble.bg} shadow-[0_10px_30px_rgba(75,100,180,0.14)] backdrop-blur-sm`}
                                initial={{ opacity: 0, scale: 0.7 }}
                                whileInView={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                viewport={{ once: true }}
                                animate={{
                                    y: [0, -5, 0],
                                }}
                                transition={{
                                    opacity: {
                                        duration: 0.5,
                                        delay: bubble.delay,
                                    },
                                    scale: {
                                        duration: 0.5,
                                        delay: bubble.delay,
                                    },
                                    y: {
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: bubble.delay,
                                    },
                                }}
                            >
                                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white/80 shadow-xl">
                                    <Image
                                        src={bubble.icon}
                                        alt=""
                                        width={160}
                                        height={160}
                                        quality={100}
                                        sizes="80px"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* CENTRAL EXCHANGE BUBBLE */}
                    <motion.div
                        className="absolute left-1/2 top-1/2 z-20 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:h-32 sm:w-32"
                        animate={{
                            scale: [1, 1.04, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        {/* Glow */}
                        <div className="absolute inset-[-25px] rounded-full bg-blue-300/20 blur-2xl" />

                        {/* Bubble */}
                        <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/60 bg-gradient-to-br from-indigo-400 via-blue-500 to-sky-400 shadow-[0_15px_45px_rgba(59,130,246,0.35)]">
                            <BsArrowLeftRight
                                className="h-12 w-12 text-white sm:h-14 sm:w-14"
                                strokeWidth={1.8}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* MOBILE VISUAL */}
                <div className="relative mt-12 h-[320px] w-full max-w-lg shrink-0 lg:hidden">
                    {/* Soft glow */}
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl" />

                    {/* Top Left - Laptop */}
                    <motion.div
                        className="absolute left-[8%] top-[3%] flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-blue-100/80 shadow-[0_10px_25px_rgba(75,100,180,0.14)] sm:left-[14%]"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <Image
                            src="/assets/laptop.png"
                            alt=""
                            width={48}
                            height={48}
                            quality={100}
                            className="h-full w-full object-contain"
                        />
                    </motion.div>

                    {/* Top Right - Music */}
                    <motion.div
                        className="absolute right-[8%] top-[5%] flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-orange-100/80 shadow-[0_10px_25px_rgba(75,100,180,0.14)] sm:right-[14%]"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.5,
                        }}
                    >
                        <Image
                            src="/assets/headphone.png"
                            alt=""
                            width={48}
                            height={48}
                            quality={100}
                            className="h-full w-full object-contain"
                        />
                    </motion.div>

                    {/* Left - Camera */}
                    <motion.div
                        className="absolute left-[1%] top-[42%] flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-indigo-100/80 shadow-[0_10px_25px_rgba(75,100,180,0.14)] sm:left-[8%]"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.8,
                        }}
                    >
                        <Image
                            src="/assets/camera.png"
                            alt=""
                            width={48}
                            height={48}
                            quality={100}
                            className="h-full w-full object-contain"
                        />
                    </motion.div>

                    {/* Right - Clock */}
                    <motion.div
                        className="absolute right-[1%] top-[42%] flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-purple-100/80 shadow-[0_10px_25px_rgba(75,100,180,0.14)] sm:right-[8%]"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 4.3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                    >
                        <Image
                            src="/assets/iphone.png"
                            alt=""
                            width={48}
                            height={48}
                            quality={100}
                            className="h-full w-full object-contain"
                        />
                    </motion.div>

                    {/* Bottom Left - Leaf */}
                    <motion.div
                        className="absolute bottom-[2%] left-[22%] flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-green-100/80 shadow-[0_10px_25px_rgba(75,100,180,0.14)]"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1.4,
                        }}
                    >
                        <Image
                            src="/assets/plant.png"
                            alt=""
                            width={48}
                            height={48}
                            quality={100}
                            className="h-full w-full object-contain"
                        />
                    </motion.div>

                    {/* Bottom Right - Users */}
                    <motion.div
                        className="absolute bottom-[2%] right-[22%] flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-violet-100/80 shadow-[0_10px_25px_rgba(75,100,180,0.14)]"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1.8,
                        }}
                    >
                        <Image
                            src="/assets/piano.png"
                            alt=""
                            width={48}
                            height={48}
                            quality={100}
                            className="h-full w-full object-contain"
                        />
                    </motion.div>

                    {/* Central Exchange Bubble */}
                    <motion.div
                        className="absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        {/* Glow */}
                        <div className="absolute inset-[-22px] rounded-full bg-blue-300/20 blur-2xl" />

                        {/* Bubble */}
                        <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/60 bg-gradient-to-br from-indigo-400 via-blue-500 to-sky-400 shadow-[0_15px_40px_rgba(59,130,246,0.3)]">
                            <BsArrowLeftRight
                                className="h-5 w-5 text-white"
                                strokeWidth={1.2}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}