'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    LuArrowLeftRight,
    LuBadgeCheck,
    LuBrush,
    LuHouse,
    LuScissors,
} from 'react-icons/lu';

const services = [
    {
        id: 'logo',
        title: 'Logo Design',
        description: 'Trade creative skills for services you need.',
        image: '/assets/services/LogoDesign.png',
        icon: LuBrush,
        position:
            'left-1/2 top-[2%] -translate-x-1/2',
        delay: 0,
        bg: 'bg-indigo-100/80',
        iconBg: 'bg-indigo-500',
    },
    {
        id: 'haircut',
        title: 'Haircut and Style',
        description: 'Offer your service and receive value in return.',
        image: '/assets/services/HairCuts.png',
        icon: LuScissors,
        position:
            'left-[3%] bottom-[-2%] lg:left-[5%] lg:bottom-[2%]',
        delay: 0.35,
        bg: 'bg-blue-100/80',
        iconBg: 'bg-blue-500',
    },
    {
        id: 'repair',
        title: 'Home Repairing',
        description: 'Get repairs without paying with cash.',
        image: '/assets/services/Home-repair.png',
        icon: LuHouse,
        position:
            'right-[3%] bottom-[-2%] lg:right-[4%] lg:bottom-[2%]',
        delay: 0.7,
        bg: 'bg-purple-100/80',
        iconBg: 'bg-purple-500',
    },
];

function ServiceBubble({
    service,
    desktop = true,
}) {
    const Icon = service.icon;

    return (
        <div
            className={
                desktop
                    ? `cursor-pointer absolute ${service.position} z-10 w-[210px] sm:w-[230px] lg:w-[245px]`
                    : 'relative w-full cursor-pointer max-w-[290px]'
            }
        >
            <div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: service.delay,
                }}
                className="group"
            >
                {/* Service image */}
                <div
                    className={`relative overflow-hidden rounded-[28px] border border-white/80 ${service.bg} p-2.5 shadow-[0_18px_45px_rgba(67,84,160,0.14)] backdrop-blur-sm`}
                >
                    <div className="relative h-[150px] overflow-hidden rounded-[21px] bg-white/70 sm:h-[165px] lg:h-[175px]">
                        <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            sizes="(max-width: 768px) 290px, 245px"
                            quality={100}
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/20 via-transparent to-white/10" />

                        {/* Floating service icon */}
                        <div
                            className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl ${service.iconBg} text-white shadow-lg ring-4 ring-white/50`}
                        >
                            <Icon className="h-5 w-5" strokeWidth={1.8} />
                        </div>
                    </div>

                    {/* Service information */}
                    <div className="px-2.5 pb-2 pt-3">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-[14px] font-bold tracking-tight text-[#172554]">
                                {service.title}
                            </h3>

                            <LuBadgeCheck className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                        </div>

                        <p className="mt-1 text-[11px] leading-4 text-slate-500">
                            {service.description}
                        </p>

                        <span className="mt-2.5 inline-flex rounded-full bg-white/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-indigo-500 shadow-sm">
                            Trade a service
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ServicesBarterSection() {
    return (
        <section className="relative isolate overflow-hidden bg-[#f7faff]">
            {/* Background atmosphere */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[45%] top-[45%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-[110px]" />

                <div className="absolute left-[-120px] top-[-120px] h-[330px] w-[330px] rounded-full bg-indigo-100/30 blur-[100px]" />

                <div className="absolute bottom-[-150px] right-[-100px] h-[380px] w-[380px] rounded-full bg-purple-100/30 blur-[110px]" />
            </div>

            <div className="relative mx-auto flex min-h-[620px] w-full max-w-7xl flex-col items-center px-5 py-16 sm:px-8 lg:min-h-[680px] lg:px-12 lg:py-20">
                {/* Heading */}
                <motion.div
                    className="relative z-30 max-w-xl text-center"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-indigo-600 sm:text-[10px]">
                        <LuArrowLeftRight className="h-3 w-3" />
                        Services have value
                    </span>

                    <h2 className="mt-4 text-2xl font-bold leading-[1.12] tracking-tight text-[#12284f] sm:text-3xl lg:text-4xl">
                        Trade your skills for
                        <br className="hidden sm:block" />
                        <span className="text-indigo-500"> services you need.</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500 sm:text-[15px]">
                        Barter makes it simple to exchange what you can offer
                        for something valuable from someone else — no cash
                        required.
                    </p>
                </motion.div>

                {/* Desktop service exchange visual */}
                <div className="relative mt-8 hidden h-[440px] w-full max-w-5xl lg:block">
                    {/* Connecting network */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute left-[31%] top-[35%] h-px w-[38%] rotate-[8deg] bg-indigo-200/60" />
                        <div className="absolute left-[29%] top-[53%] h-px w-[42%] -rotate-[8deg] bg-blue-200/60" />
                        <div className="absolute left-[49%] top-[20%] h-[65%] w-px rotate-[58deg] bg-purple-200/50" />
                        <div className="absolute left-[51%] top-[20%] h-[65%] w-px -rotate-[58deg] bg-blue-200/50" />
                    </div>

                    {/* Central soft halo */}
                    <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/75 blur-2xl" />

                    {services.map((service) => (
                        <ServiceBubble key={service.id} service={service} />
                    ))}

                    {/* Central barter exchange */}
                    <motion.div
                        className="absolute left-1/2 top-[85%] z-20 -translate-x-1/2 -translate-y-1/2"
                        initial={{ opacity: 0.6, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        animate={{ scale: [1, 1.045, 1] }}
                    >
                        <div className="absolute inset-[-30px] rounded-full bg-indigo-300/20 blur-2xl" />

                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500 shadow-[0_20px_55px_rgba(79,70,229,0.32)]">
                            <div className="absolute inset-2 rounded-full border border-white/20" />

                            <LuArrowLeftRight
                                className="h-11 w-11 text-white"
                                strokeWidth={1.7}
                            />

                            <span className="absolute -bottom-8 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                                Exchange value
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Mobile layout */}
                <div className="mt-10 flex w-full max-w-md flex-col items-center gap-5 lg:hidden">
                    {/* Logo Design */}
                    <ServiceBubble service={services[0]} desktop={false} />

                    {/* Exchange */}
                    <motion.div
                        className="relative z-20 flex h-16 w-16 items-center justify-center rounded-full"
                        initial={{ opacity: 0.6, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className="absolute inset-[-18px] rounded-full bg-indigo-300/20 blur-2xl" />

                        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500 shadow-[0_15px_40px_rgba(79,70,229,0.3)]">
                            <LuArrowLeftRight className="h-6 w-6 text-white" />
                        </div>
                    </motion.div>

                    {/* Other services - single column */}
                    <div className="flex w-full flex-col items-center gap-5">
                        <ServiceBubble service={services[1]} desktop={false} />
                        <ServiceBubble service={services[2]} desktop={false} />
                    </div>
                </div>
            </div>
        </section>
    );
}
