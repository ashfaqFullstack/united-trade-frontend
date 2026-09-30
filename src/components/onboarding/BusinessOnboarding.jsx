
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OnboardingLayout from '../layout/OnboardingLayout';
import BusinessDetailsStep from './steps/BusinessDetailsStep';
import BusinessInfoStep from './steps/BusinessInfoStep';
import MembershipStep from './steps/MembershipStep';
import BusinessDocumentsStep from './steps/BusinessDocumentStep';
import SuccessStep from './SuccessStep';

const steps = [
    { title: 'Business Details', subtitle: 'Tell us about your business so others can find and trust you.' },
    { title: 'Business Information', subtitle: 'What does your business do, and how long has it been running?' },
    { title: 'Membership Package', subtitle: 'Choose the trade limit tier you\'d like to apply for.' },
    { title: 'Verification & Declaration', subtitle: 'Upload documents so we can verify and approve your business.' },
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
            onBack={step > 1 && step < steps.length ? () => setStep((s) => s - 1) : null}
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
                    {step === 2 && <BusinessInfoStep onNext={() => setStep(3)} />}
                    {step === 3 && <MembershipStep onNext={() => setStep(4)} />}
                    {step === 4 && <BusinessDocumentsStep onNext={() => setStep(5)} />}
                    {step === 5 && <SuccessStep />}
                </motion.div>
            </AnimatePresence>
        </OnboardingLayout>
    );
}