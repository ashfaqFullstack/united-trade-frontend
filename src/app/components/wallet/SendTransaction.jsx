'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useSendTransaction } from '@/hooks/useTransaction';
import QrScanner from './qr/QrScanner';
import PinKeypad from './PinKeypad';

export default function SendTransactionCard() {
    const [step, setStep] = useState('scan'); // scan | amount | pin | done
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const { mutate: send, isPending } = useSendTransaction();

    const handleScan = (userId) => {
        setReceiverId(userId);
        setStep('amount');
        toast.success('Recipient detected — enter amount to continue');
    };

    const handleAmountNext = () => {
        if (!amount || Number(amount) <= 0) {
            toast.error('Enter a valid amount');
            return;
        }
        setStep('pin');
    };

    const reset = () => {
        setStep('scan');
        setReceiverId('');
        setAmount('');
        setPin('');
        setError('');
        setResult(null);
    };

    if (result) {
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
                    ✓
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">Transaction Successful</h3>
                <p className="mt-1 text-sm text-slate-500">Receipt ID: {result.receiptId}</p>
                <button
                    type="button"
                    onClick={reset}
                    className="mt-5 w-full cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Send Another
                </button>
            </div>
        );
    }

    if (step === 'pin') {
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <PinKeypad
                    length={4}
                    value={pin}
                    onChange={setPin}
                    error={error}
                    title="Enter Your Wallet PIN"
                    subtitle={`Confirm sending $${amount}`}
                    onSubmit={(val) =>
                        send(
                            { receiverId, amount: Number(amount), pin: val },
                            {
                                onSuccess: (data) => setResult(data),
                                onError: (err) => {
                                    setError(err.response?.data?.message || 'Transaction failed');
                                    setPin('');
                                },
                            }
                        )
                    }
                    isSubmitting={isPending}
                    submitLabel="Confirm & Send"
                />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-md space-y-5">
            <h2 className="text-center text-lg font-bold text-slate-900">Send Money</h2>
            <p className="text-center text-sm text-slate-500">Scan the recipient's QR code to continue</p>

            <div className="rounded-2xl border border-slate-100 bg-white p-5">
                {step === 'scan' && (
                    <>
                        <p className="mb-4 text-center text-sm font-semibold text-slate-700">Scan QR Code</p>
                        <QrScanner onScan={handleScan} />
                    </>
                )}

                {step === 'amount' && (
                    <>
                        <p className="text-center text-sm font-semibold text-slate-700">Enter Amount</p>
                        <p className="mt-1 text-center text-xs text-slate-400">A 5% fee applies from both sides.</p>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            autoFocus
                            className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <button
                            type="button"
                            onClick={handleAmountNext}
                            className="mt-5 w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Continue
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}