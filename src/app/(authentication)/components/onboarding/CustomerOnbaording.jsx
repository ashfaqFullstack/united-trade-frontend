'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OnboardingLayout from './OnboardingLayout';
import CustomerDetailsStep from './CustomerDetailsStep';
import SuccessStep from './SuccessStep';

const steps = [
    { title: 'Your Details', subtitle: 'Tell us a little about yourself so others can connect with you.' },
    { title: "You're All Set!", subtitle: null },
];

export default function CustomerOnboarding() {
    const [step, setStep] = useState(1);

    return (
        <OnboardingLayout step={step} totalSteps={steps.length} title={steps[step - 1].title} subtitle={steps[step - 1].subtitle}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                >
                    {step === 1 && <CustomerDetailsStep onNext={() => setStep(2)} />}
                    {step === 2 && <SuccessStep />}
                </motion.div>
            </AnimatePresence>
        </OnboardingLayout>
    );
}