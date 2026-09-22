"use client";

import Hero from "@/components/Home/Hero";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiGlobe, FiRepeat, FiSlash, FiStar, FiUsers } from "react-icons/fi";
import { RiFileAiFill } from "react-icons/ri";

const benefits = [
    {
        icon: FiSlash,
        title: "No Cash Needed",
        description: "Trade items and services without spending money.",
        iconClass: "bg-blue-100 text-blue-600",
    },
    {
        icon: FiStar,
        title: "Get More Value",
        description: "Turn your unused items into something useful.",
        iconClass: "bg-sky-100 text-sky-600",
    },
    {
        icon: FiUsers,
        title: "Build Connections",
        description: "Meet like-minded people and grow your network.",
        iconClass: "bg-violet-100 text-violet-600",
    },
    {
        icon: RiFileAiFill,
        title: "Support Sustainability",
        description: "Reduce waste and give items a second life.",
        iconClass: "bg-emerald-100 text-emerald-500",
    },
];

const steps = [
    {
        number: "1",
        title: "List Your Item",
        description: "Add your product or service to the marketplace.",
    },
    {
        number: "2",
        title: "Find a Match",
        description: "Browse or search for items you need.",
    },
    {
        number: "3",
        title: "Make an Offer",
        description: "Start a barter swap and connect with the other user.",
    },
    {
        number: "4",
        title: "Complete the Trade",
        description: "Exchange items and enjoy your new value!",
    },
];

const products = [
    {
        src: "/assets/headphone.png",
        alt: "Shoe",
        position: "top-[15%] left-[0%]",
    },
    {
        src: "/assets/laptop.png",
        alt: "Laptop",
        position: "top-[-8%] left-[39%]",
    },
    {
        src: "/assets/camera.png",
        alt: "Camera",
        position: "top-[15%] right-[0%]",
    },
    {
        src: "/assets/iphone.png",
        alt: "Phone",
        position: "bottom-[5%] right-[10%]",
    },
    {
        src: "/assets/bike.png",
        alt: "Bicycle",
        position: "bottom-[3%] left-[12%]",
    },
];

export default function BarterSections() {
    return (
        <>
            <Hero />
            {/* =========================================================
          SECTION 1 — WHY BARTER
      ========================================================= */}
            <section className="relative overflow-hidden bg-[#f7faff] py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">

                    {/* Heading */}
                    <div className="mb-12 max-w-2xl">
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                            Key Benefits
                        </span>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#102f68] sm:text-4xl">
                            Why Barter?
                        </h2>

                        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                            It&apos;s simple, secure and gives you more freedom than
                            traditional buying and selling.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;

                            return (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{
                                        y: -5,
                                        transition: { duration: 0.2 },
                                    }}
                                    className="rounded-xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(30,80,160,0.05)]"
                                >
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-full ${benefit.iconClass}`}
                                    >
                                        <Icon size={22} strokeWidth={2} />
                                    </div>

                                    <h3 className="mt-5 text-[15px] font-bold text-[#102f68]">
                                        {benefit.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =========================================================
          SECTION 2 — HOW BARTERING WORKS
      ========================================================= */}
            <section className="relative overflow-hidden bg-white py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

                        {/* LEFT */}
                        <div>
                            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                                Simple Steps
                            </span>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#102f68] sm:text-4xl">
                                How Bartering Works?
                            </h2>

                            <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
                                List your items, find what you need, and make a trade —
                                it&apos;s that easy.
                            </p>

                            <div className="mt-9 space-y-6">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={step.number}
                                        initial={{ opacity: 0, x: -25 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.1,
                                        }}
                                        className="flex gap-4"
                                    >
                                        {/* Number */}
                                        <div className="relative flex shrink-0 flex-col items-center">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-semibold text-white shadow-md shadow-blue-200">
                                                {step.number}
                                            </div>

                                            {index !== steps.length - 1 && (
                                                <div className="absolute top-9 h-10 w-px bg-blue-100" />
                                            )}
                                        </div>

                                        {/* Text */}
                                        <div>
                                            <h3 className="text-sm font-bold text-[#102f68]">
                                                {step.title}
                                            </h3>

                                            <p className="mt-1 text-xs leading-6 text-slate-400 sm:text-sm">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT — ORBIT */}
                        <div className="relative mx-auto h-[420px] w-full max-w-[520px]">

                            {/* Soft background glow */}
                            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl" />

                            {/* Outer orbit */}
                            <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100 sm:h-[370px] sm:w-[370px]" />

                            {/* Inner orbit */}
                            <div className="absolute left-1/2 top-1/2 h-[215px] w-[215px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/80 sm:h-[250px] sm:w-[250px]" />

                            {/* Animated orbit ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 22,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute left-1/2 top-1/2 h-[370px] w-[370px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-transparent border-t-blue-300 border-r-blue-200"
                            />

                            {/* Center */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="absolute left-1/2 top-1/2 z-20 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shadow-[0_15px_50px_rgba(79,70,229,0.3)]"
                            >
                                <FiRepeat
                                    size={48}
                                    strokeWidth={1.7}
                                    className="text-white"
                                />
                            </motion.div>

                            {/* Product orbit */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 28,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute inset-0"
                            >
                                {products.map((product) => (
                                    <motion.div
                                        key={product.alt}
                                        className={`absolute ${product.position}`}
                                        animate={{
                                            rotate: -360,
                                        }}
                                        transition={{
                                            duration: 28,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    >
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white bg-white p-2 shadow-[0_8px_25px_rgba(50,90,160,0.12)] sm:h-24 sm:w-24">
                                            <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-50">
                                                <Image
                                                    src={product.src}
                                                    alt={product.alt}
                                                    fill
                                                    sizes="96px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Counter rotation so products stay upright */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{
                                    duration: 28,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="pointer-events-none absolute inset-0"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
          SECTION 3 — COMMUNITY CTA
      ========================================================= */}
            <section className="px-4 pb-16 lg:pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative mx-auto max-w-[1400px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#eaf5ff] via-[#edf3ff] to-[#f4ecff] px-7 py-9 sm:px-10 lg:px-12 lg:py-10"
                >
                    {/* Background glow */}
                    <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
                    <div className="absolute -bottom-32 left-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />

                    <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr_auto]">

                        {/* Text */}
                        <div>
                            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-blue-600">
                                Join The Movement
                            </span>

                            <h2 className="mt-3 max-w-md text-2xl font-bold leading-tight text-[#102f68] sm:text-3xl">
                                More People. More Trades.
                                <br />
                                A Bigger Community.
                            </h2>

                            <p className="mt-3 max-w-lg text-xs leading-6 text-slate-500 sm:text-sm">
                                Be part of a growing network of traders who believe in a
                                smarter, more sustainable way to get what they need.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 border-y border-slate-200/70 py-5 lg:border-y-0 lg:border-l lg:py-0 lg:pl-8">
                            <div className="text-center">
                                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <FiUsers size={18} />
                                </div>

                                <div className="mt-2 text-xl font-bold text-[#102f68]">
                                    50K+
                                </div>

                                <p className="mt-1 text-[10px] text-slate-400">
                                    Active Members
                                </p>
                            </div>

                            <div className="border-l border-slate-200/70 text-center">
                                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <FiRepeat size={18} />
                                </div>

                                <div className="mt-2 text-xl font-bold text-[#102f68]">
                                    120K+
                                </div>

                                <p className="mt-1 text-[10px] text-slate-400">
                                    Successful Trades
                                </p>
                            </div>

                            <div className="border-l border-slate-200/70 text-center">
                                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <FiGlobe size={18} />
                                </div>

                                <div className="mt-2 text-xl font-bold text-[#102f68]">
                                    100+
                                </div>

                                <p className="mt-1 text-[10px] text-slate-400">
                                    Countries
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link href="/marketplace">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className="group flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-200"
                            >
                                Start Trading
                                <FiArrowRight
                                    size={17}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </>
    );
}