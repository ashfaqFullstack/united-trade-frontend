'use client';

import { useState } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import { toast } from 'sonner';

import { useCompleteCustomerProfile } from '@/hooks/useCustomer';
import MembershipTierSelect from '../MemberShipTierSelect';

export default function CustomerMembershipStep({ onNext }) {
    const [tier, setTier] = useState('STANDARD');
    const { mutate: saveStep, isPending } = useCompleteCustomerProfile();

    const handleContinue = () => {
        saveStep(
            { membershipTier: tier },
            {
                onSuccess: () => onNext(),
                onError: (error) => toast.error(error.response?.data?.message || 'Something went wrong'),
            }
        );
    };

    return (
        <div className="space-y-4">
            <MembershipTierSelect value={tier} onChange={setTier} />

            <button
                type="button"
                onClick={handleContinue}
                disabled={isPending}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
                {isPending ? 'Saving...' : 'Continue'}
                {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
            <p className="text-center text-xs text-slate-400">Final credit limit will be confirmed by our team upon approval.</p>
        </div>
    );
}