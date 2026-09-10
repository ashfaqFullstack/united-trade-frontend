'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CiClock2, CiMail } from "react-icons/ci";
import { FaHome, FaInfinity } from "react-icons/fa";

import { useAuthStore } from '@/store/useAuthStore';

export default function PendingApprovalCard() {
    const user = useAuthStore((state) => state.user);
    const isRejected = user?.status === 'REJECTED';

    return (
        <section className="flex min-h-screen items-center justify-center bg-[#F4F6FF] p-6">
            <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">
                <div className="mb-6 flex items-center justify-center gap-2 text-base font-semibold text-slate-900">
                    <FaInfinity className="h-5 w-5 text-indigo-600" />
                    Barter
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isRejected ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'
                        }`}
                >
                    <CiClock2 className="h-8 w-8" />
                </motion.div>

                <h2 className="mt-6 text-xl font-bold text-slate-900">
                    {isRejected ? 'Application Not Approved' : 'Your Account is Under Review'}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {isRejected
                        ? 'Unfortunately your application could not be approved at this time. If you think this is a mistake, please reach out to our support team.'
                        : "We're reviewing your profile and documents. This usually takes less than 24 hours — we'll notify you by email once you're approved."}
                </p>

                {!isRejected && (
                    <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
                        <CiMail className="h-4 w-4" />
                        We'll email you at {user?.email}
                    </div>
                )}

                <Link
                    href="/"
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                >
                    <FaHome className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>
        </section>
    );
}