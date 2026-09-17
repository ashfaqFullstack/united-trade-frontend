"use client";

import Image from "next/image";
import { FiSearch, FiShield, FiCheckCircle } from "react-icons/fi";

export default function MarketplaceHero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-50 via-blue-50/60 to-slate-50">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-blue-200/20 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl" />

            <div className="relative mx-auto flex min-h-[330px] w-full max-w-7xl items-center px-5 py-8 sm:px-6 lg:min-h-[470px] lg:px-10 lg:py-6">
                <div className="grid w-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-4">

                    {/* ================= LEFT CONTENT ================= */}
                    <div className="relative z-20 max-w-xl">
                        {/* Small Label */}
                        <div className="mb-4 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
                                Marketplace
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="max-w-[520px] text-3xl font-extrabold leading-[1.12] tracking-tight text-[#173B78] sm:text-4xl lg:text-[42px]">
                            Discover Unique Items
                            <br className="hidden sm:block" />
                            from Our Community
                        </h1>

                        {/* Description */}
                        <p className="mt-4 max-w-[470px] text-sm leading-6 text-slate-500 sm:text-[15px]">
                            Find great products, services and more — all through
                            barter. No cash needed, just real value exchange.
                        </p>
                        {/* Trust Features */}
                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                            <TrustItem
                                icon={FiShield}
                                text="Safe & Secure"
                            />

                            <TrustItem
                                icon={FiCheckCircle}
                                text="Verified Sellers"
                            />

                            {/* <TrustItem
                                icon={FiGlobe2}
                                text="Global Community"
                            /> */}
                        </div>
                    </div>

                    {/* ================= RIGHT VISUAL ================= */}
                    <div className="relative flex min-h-[250px] items-center justify-center lg:min-h-[390px]">
                        {/* Soft decorative blobs */}
                        <div className="absolute right-[8%] top-[8%] h-32 w-32 rounded-full bg-blue-200/30 blur-2xl sm:h-44 sm:w-44" />
                        <div className="absolute bottom-[5%] left-[20%] h-28 w-28 rounded-full bg-indigo-200/25 blur-2xl sm:h-40 sm:w-40" />

                        {/* Optional abstract shapes behind image */}
                        <div className="absolute right-[22%] top-[12%] h-28 w-28 rotate-12 rounded-[35%] bg-blue-400/15 sm:h-40 sm:w-40" />

                        {/* YOUR SINGLE OBJECT IMAGE */}
                        <div className="relative z-10 w-full max-w-[650px]">
                            <Image
                                src="/assets/marketplace-items.png"
                                alt="Marketplace items"
                                width={900}
                                height={600}
                                priority
                                className="h-auto w-full object-contain drop-shadow-[0_20px_25px_rgba(30,64,175,0.08)] transition-transform duration-500 hover:scale-[1.02]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ================= TRUST ITEM ================= */

function TrustItem({ icon: Icon, text }) {
    return (
        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 sm:text-[11px]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-sm">
                <Icon className="h-3.5 w-3.5" />
            </span>

            <span>{text}</span>
        </div>
    );
}