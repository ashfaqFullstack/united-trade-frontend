'use client';

import { useState } from 'react';
import PinKeypad from '@/components/ui/PinKeypad';
import { useForgotPin, useResetPin } from '@/hooks/useWallet';

export default function ForgotPinCard() {
    const [step, setStep] = useState('request');
    const [otp, setOtp] = useState('');
    const [newPin, setNewPin] = useState('');
    const [error, setError] = useState('');

    const { mutate: requestOtp, isPending: sending } = useForgotPin();
    const { mutate: reset, isPending: resetting } = useResetPin();

    if (step === 'request') {
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
                <h3 className="text-base font-bold text-slate-900">Forgot Your PIN?</h3>
                <p className="mt-1 text-sm text-slate-500">We'll send a one-time code to your email.</p>
                <button
                    type="button"
                    onClick={() => requestOtp(undefined, { onSuccess: () => setStep('otp') })}
                    disabled={sending}
                    className="mt-5 w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                >
                    {sending ? 'Sending...' : 'Send OTP'}
                </button>
            </div>
        );
    }

    if (step === 'otp') {
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <PinKeypad
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    title="Enter OTP"
                    subtitle="Check your email for the 6-digit code."
                    onSubmit={() => setStep('newpin')}
                />
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <PinKeypad
                length={4}
                value={newPin}
                onChange={setNewPin}
                error={error}
                title="Set New PIN"
                onSubmit={() =>
                    reset(
                        { otp, newPin },
                        {
                            onError: (err) => {
                                setError(err.response?.data?.message || 'Invalid or expired OTP');
                                setStep('request');
                                setOtp('');
                                setNewPin('');
                            },
                        }
                    )
                }
                isSubmitting={resetting}
                submitLabel="Reset PIN"
            />
        </div>
    );
}