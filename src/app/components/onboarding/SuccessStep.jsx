'use client';

import { motion } from 'framer-motion';
import { LuCheck } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

export default function SuccessStep() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center py-4 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg"
            >
                <LuCheck className="h-8 w-8" />
            </motion.div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">You&apos;re All Set!</h3>
            <p className="mt-2 text-sm text-slate-500">
                Your profile has been submitted. Our team will review it shortly and get you started.
            </p>

            <button
                type="button"
                onClick={() => router.push('/pending-approval')}
                className="mt-6 w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
            >
                Continue
            </button>
        </div>
    );
}