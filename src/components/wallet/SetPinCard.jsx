'use client';

import { useState } from 'react';
import { useSetPin } from '@/hooks/useWallet';
import PinKeypad from './PinKeypad';

export default function SetPinCard({ onSuccess }) {
    const [stage, setStage] = useState('enter');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const { mutate: savePin, isPending } = useSetPin();

    const handleFirstContinue = () => {
        if (pin.length !== 4) return;
        setStage('confirm');
    };

    const handleConfirm = () => {
        if (confirmPin !== pin) {
            setError('PINs do not match');
            setConfirmPin('');
            return;
        }
        setError('');
        savePin({ pin }, { onSuccess: () => onSuccess?.() });
    };

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6">
            {stage === 'enter' ? (
                <PinKeypad
                    length={4}
                    value={pin}
                    onChange={setPin}
                    title="Set Your Wallet PIN"
                    subtitle="Create a 4-digit PIN to secure your wallet."
                    onSubmit={handleFirstContinue}
                />
            ) : (
                <PinKeypad
                    length={4}
                    value={confirmPin}
                    onChange={setConfirmPin}
                    error={error}
                    title="Confirm Your PIN"
                    subtitle="Enter the same PIN again to confirm."
                    onSubmit={handleConfirm}
                    isSubmitting={isPending}
                    submitLabel="Confirm PIN"
                />
            )}
        </div>
    );
}