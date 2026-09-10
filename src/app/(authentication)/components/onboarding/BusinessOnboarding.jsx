'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OnboardingLayout from './OnboardingLayout';
import BusinessDetailsStep from './BusinessDetailsStep';
import ContactDetailsStep from './ContactDetailsStep';
import MembershipStep from './MembershipStep';
import BusinessDocumentsStep from './BusinessDocumentStep';
import SuccessStep from './SuccessStep';

const steps = [
    { title: 'Business Details', subtitle: 'Tell us about your business so others can find and trust you.' },
    { title: 'Contact Details', subtitle: 'How can we and other members reach you?' },
    { title: 'Membership Package', subtitle: 'Choose the trade limit tier you\'d like to apply for.' },
    { title: 'Identification & Verification', subtitle: 'Upload documents so we can verify and approve your business.' },
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
                    {step === 2 && <ContactDetailsStep onNext={() => setStep(3)} />}
                    {step === 3 && <MembershipStep onNext={() => setStep(4)} />}
                    {step === 4 && <BusinessDocumentsStep onNext={() => setStep(5)} />}
                    {step === 5 && <SuccessStep />}
                </motion.div>
            </AnimatePresence>
        </OnboardingLayout>
    );
}