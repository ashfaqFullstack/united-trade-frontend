'use client';

import { useState } from 'react';
import PinKeypad from '@/app/components/ui/PinKeypad';
import { useChangePin } from '@/hooks/useWallet';

export default function ChangePinCard() {
    const [stage, setStage] = useState('old');
    const [oldPin, setOldPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [error, setError] = useState('');
    const { mutate: change, isPending } = useChangePin();

    const handleOldContinue = () => {
        if (oldPin.length !== 4) return;
        setStage('new');
    };

    const handleNewSubmit = () => {
        change(
            { oldPin, newPin },
            {
                onSuccess: () => {
                    setStage('old');
                    setOldPin('');
                    setNewPin('');
                },
                onError: (err) => {
                    setError(err.response?.data?.message || 'Failed to change PIN');
                    setStage('old');
                    setOldPin('');
                    setNewPin('');
                },
            }
        );
    };

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6">
            {stage === 'old' ? (
                <PinKeypad
                    length={4}
                    value={oldPin}
                    onChange={setOldPin}
                    error={error}
                    title="Enter Current PIN"
                    onSubmit={handleOldContinue}
                />
            ) : (
                <PinKeypad
                    length={4}
                    value={newPin}
                    onChange={setNewPin}
                    title="Enter New PIN"
                    onSubmit={handleNewSubmit}
                    isSubmitting={isPending}
                    submitLabel="Update PIN"
                />
            )}
        </div>
    );
}