'use client';

import BackButton from '@/app/components/ui/BackButton';
import { motion } from 'framer-motion';
import { LuArrowLeft, LuInfinity } from 'react-icons/lu';

export default function OnboardingLayout({ step, totalSteps, title, subtitle, onBack, children }) {
    const progress = (step / totalSteps) * 100;

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F4F6FF] p-6">
            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                        <LuInfinity className="h-5 w-5 text-indigo-600" />
                        Barter
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                        {step}/{totalSteps}
                    </span>
                </div>

                <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>


                <div className="flex items-center justify-between" >
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
                    </div>
                    {onBack && (
                        <BackButton handleBack={onBack} titl="Back" />
                    )}
                </div>

                <div className="mt-6">{children}</div>
            </div>
        </main>
    );
}