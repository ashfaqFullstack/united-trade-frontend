'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LuInfinity, LuShieldCheck, LuUsers, LuTrendingUp } from 'react-icons/lu';
import OrbitIcons from './OrbitIcons';

const content = {
    login: {
        heading: (
            <>
                Trade What You Have.
                <br />
                Get What You Need.
            </>
        ),
        subtext: 'Join a smarter community that exchanges value, not just money.',
        footer: { icon: LuShieldCheck, text: 'Safe. Simple. Trusted.' },
    },
    register: {
        heading: (
            <>
                Create Your <span className="text-indigo-200">Barter</span> Account
            </>
        ),
        subtext: 'Join thousands of people exchanging value every day.',
        footer: null,
    },
    forgot: {
        heading: (
            <>
                Forgot Your
                <br />
                Password?
            </>
        ),
        subtext: "No worries — we'll send you an OTP to get you back in.",
        footer: { icon: LuShieldCheck, text: 'Your account stays secure.' },
    },
    reset: {
        heading: (
            <>
                Almost There.
                <br />
                Set a New Password.
            </>
        ),
        subtext: 'Enter the OTP sent to your email and choose a new password.',
        footer: { icon: LuShieldCheck, text: 'Your account stays secure.' },
    },
};

const features = [
    { icon: LuTrendingUp, text: 'Trade goods, skills, services & more' },
    { icon: LuUsers, text: 'Connect with trusted people' },
    { icon: LuShieldCheck, text: 'Build real value in your community' },
];

export default function SidePanel({ mode }) {
    const data = content[mode];

    return (
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl md:rounded-l-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 p-10 text-white">
            <div className="flex items-center gap-2 text-lg font-semibold">
                <LuInfinity className="h-6 w-6" />
                United Trade
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold leading-tight">{data.heading}</h1>
                    <p className="mt-3 max-w-xs text-sm text-indigo-100">{data.subtext}</p>
                </motion.div>
            </AnimatePresence>

            <div className="hidden md:block">
                <OrbitIcons />
            </div>

            <div className="mt-4 md:mt-0" >
                <AnimatePresence mode="wait">
                    {data.footer ? (
                        <motion.div
                            key={`${mode}-footer`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-sm text-indigo-100"
                        >
                            <data.footer.icon className="h-4 w-4" />
                            {data.footer.text}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register-footer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm"
                        >
                            {features.map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-2 text-sm">
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {text}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}