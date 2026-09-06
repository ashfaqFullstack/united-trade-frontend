'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OnboardingLayout from './OnboardingLayout';
import BusinessDetailsStep from './BusinessDetailsStep';
import BusinessDocumentsStep from './BusinessDocumentStep';
import SuccessStep from './SuccessStep';

const steps = [
    { title: 'Business Details', subtitle: 'Tell us about your business so others can find and trust you.' },
    { title: 'Upload Documents', subtitle: 'Add verification documents so we can approve your business.' },
    { title: "You're All Set!", subtitle: null },
];

export default function BusinessOnboarding() {
    const [step, setStep] = useState(1);

    return (
        <OnboardingLayout
            step={step}
            totalSteps={steps.length}
            title={steps[step - 1].title}
            subtitle={steps[step - 1].subtitle}
            onBack={step > 1 && step < 3 ? () => setStep((s) => s - 1) : null}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                >
                    {step === 1 && <BusinessDetailsStep onNext={() => setStep(2)} />}
                    {step === 2 && <BusinessDocumentsStep onNext={() => setStep(3)} />}
                    {step === 3 && <SuccessStep />}
                </motion.div>
            </AnimatePresence>
        </OnboardingLayout>
    );
}