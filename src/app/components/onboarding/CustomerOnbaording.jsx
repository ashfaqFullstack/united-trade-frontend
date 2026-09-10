'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OnboardingLayout from '../layout/OnboardingLayout';
import CustomerDetailsStep from './steps/CustomerDetailsStep';
import SuccessStep from './SuccessStep';
import { steps } from '@/const/const';
import CustomerMembershipStep from './steps/CustomerMemberShipStep';

export default function CustomerOnboarding() {
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
                    {step === 1 && <CustomerDetailsStep onNext={() => setStep(2)} />}
                    {step === 2 && <CustomerMembershipStep onNext={() => setStep(3)} />}
                    {step === 3 && <SuccessStep />}
                </motion.div>
            </AnimatePresence>
        </OnboardingLayout>
    );
}