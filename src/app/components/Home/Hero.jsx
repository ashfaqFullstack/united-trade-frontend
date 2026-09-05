"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productPairs } from "@/const/const";
import ProductCard from "./ProductCard";

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
    const [productIndex, setProductIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProductIndex((prev) => (prev + 1) % productPairs.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative overflow-hidden bg-white">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 md:gap-12 md:py-24"
            >
                {/* Left content */}
                <div className="text-center md:text-left">
                    <motion.span
                        variants={fadeUp}
                        className="inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-600"
                    >
                        Trade &nbsp;•&nbsp; Connect &nbsp;•&nbsp; Get More
                    </motion.span>

                    <motion.h1
                        variants={fadeUp}
                        className="mt-6 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl"
                    >
                        Trade What You Have.
                        <br />
                        <span className="text-indigo-600">Get What You Need.</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="mx-auto mt-5 max-w-md text-sm text-slate-500 sm:text-base md:mx-0"
                    >
                        A smarter way to exchange goods, skills, and services without
                        relying entirely on money.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start"
                    >
                        <Link
                            href="/auth"
                            className="flex cursor-pointer items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 hover:scale-105 text-sm font-medium text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600"
                        >
                            Start Trading
                            <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                        <button className="flex cursor-pointer items-center  gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            <PlayIcon className="h-4 w-4 text-indigo-600" />
                            How It Works
                        </button>
                    </motion.div>
                </div>

                {/* Right illustration */}
                <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                    <div
                        className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400 via-blue-300/60 to-blue-200/30 blur-3xl sm:h-80 sm:w-80 md:h-[420px] md:w-[420px]"
                    />
                    {/* YOU HAVE */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`have-${productIndex}`}
                            initial={{
                                opacity: 0,
                                y: -20,
                                scale: 0.92,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 20,
                                scale: 0.92,
                            }}
                            transition={{
                                duration: 0.45,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <ProductCard
                                label="YOU HAVE"
                                name={productPairs[productIndex].have.name}
                                image={productPairs[productIndex].have.image}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* SWAP ICON */}
                    <motion.span
                        className="rounded-full bg-white p-2.5 shadow-md sm:p-3"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.7,
                        }}
                    >
                        <motion.span

                            transition={{
                                duration: 2.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="block rotate-90 sm:rotate-0"
                        >
                            <SwapIcon className="h-5 w-5 text-indigo-500 sm:h-6 sm:w-6" />
                        </motion.span>
                    </motion.span>

                    {/* YOU WANT */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`want-${productIndex}`}
                            initial={{
                                opacity: 0,
                                y: 20,
                                scale: 0.92,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -20,
                                scale: 0.92,
                            }}
                            transition={{
                                duration: 0.45,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <ProductCard
                                label="YOU WANT"
                                name={productPairs[productIndex].want.name}
                                image={productPairs[productIndex].want.image}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </section>
    );
}

function ArrowRightIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PlayIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

function SwapIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M7 8h13M17 4l3 4-3 4M17 16H4M7 20l-3-4 3-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

