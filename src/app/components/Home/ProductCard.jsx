
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function ProductCard({ label, name, image }) {
    const isHave = label === "YOU HAVE";

    return (
        <motion.div
            whileHover={{
                y: -6,
                scale: 1.02,
            }}
            transition={{
                duration: 0.25,
                ease: "easeOut",
            }}
            // className="group relative w-[145px] overflow-hidden rounded-[24px] border border-white/80 bg-white/90 p-2 shadow-[0_15px_45px_rgba(50,70,130,0.12)] backdrop-blur-xl sm:w-[165px] sm:p-2.5 md:w-[175px]"
            className="group relative w-[80vw] overflow-hidden rounded-[24px] border border-white/80 bg-white/90 p-2 shadow-[0_15px_45px_rgba(50,70,130,0.12)] backdrop-blur-xl sm:w-[165px] sm:p-2.5 md:w-[175px]"
        >
            {/* Soft card glow */}
            <div
                className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${isHave
                    ? "bg-indigo-200/40"
                    : "bg-blue-200/40"
                    }`}
            />

            {/* Shine */}
            <motion.div
                className="pointer-events-none absolute -left-20 top-0 h-full w-12 rotate-[20deg] bg-white/50 blur-md"
                animate={{
                    x: [-30, 220],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                }}
            />

            {/* Product image area */}
            <div
                className={`relative flex h-[115px] items-center justify-center overflow-hidden rounded-[19px] ${isHave
                    ? "bg-gradient-to-br from-indigo-50 via-white to-blue-50"
                    : "bg-gradient-to-br from-blue-50 via-white to-sky-50"
                    }`}
            >
                {/* Inner glow */}
                <div
                    className={`absolute h-20 w-20 rounded-full blur-2xl ${isHave
                        ? "bg-indigo-200/40"
                        : "bg-blue-200/40"
                        }`}
                />

                {/* Image */}
                <motion.div
                    animate={{
                        y: [0, -4, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="relative z-10 h-[82px] w-[82px]"
                >
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="82px"
                        quality={100}
                        className="object-contain drop-shadow-[0_8px_12px_rgba(50,70,100,0.15)]"
                    />
                </motion.div>

                {/* Floating mini dots */}
                <span className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                <span className="absolute bottom-4 right-4 h-1 w-1 rounded-full bg-blue-200" />
            </div>

            {/* Bottom content */}
            <div className="relative px-1.5 pb-1 pt-3">
                {/* Label */}
                <div className="flex items-center justify-between">
                    <span
                        className={`rounded-full px-2 py-1 text-[8px] font-bold tracking-wide ${isHave
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-blue-50 text-blue-600"
                            }`}
                    >
                        {label}
                    </span>

                    {/* Small status dot */}
                    <span className="flex items-center gap-1">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${isHave
                                ? "bg-indigo-400"
                                : "bg-blue-400"
                                }`}
                        />
                        <span className="text-[8px] font-medium text-slate-400">
                            Trade
                        </span>
                    </span>
                </div>

                {/* Product name */}
                <div className="mt-2 flex items-center justify-between">
                    <p className="truncate text-sm font-bold text-slate-800">
                        {name}
                    </p>

                    <span className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-500">
                        <ArrowRightIcon className="h-3 w-3" />
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function ArrowRightIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
