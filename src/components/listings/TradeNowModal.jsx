'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import { useMyWallet } from '@/hooks/useWallet';
import { useCreateOrder } from '@/hooks/useOrder';
import PinKeypad from '@/components/wallet/PinKeypad';

export default function TradeNowModal({ open, onClose, listing }) {
    const [step, setStep] = useState('confirm'); // confirm | pin | success
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { data: wallet } = useMyWallet(open);
    const { mutate: createOrder, isPending } = useCreateOrder();
    const router = useRouter();

    const handleClose = () => {
        setStep('confirm');
        setPin('');
        setError('');
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} title={step === 'confirm' ? 'Confirm Trade Purchase' : undefined}>
            {step === 'confirm' && (
                <div>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                            {listing?.imageUrls?.[0] && <img src={listing.imageUrls[0]} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{listing?.title}</p>
                            <p className="text-xs text-slate-400">${Number(listing?.price).toLocaleString()} Trade Value</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Amount</label>
                        <input
                            type="text"
                            value={`$${Number(listing?.price).toLocaleString()}`}
                            readOnly
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700"
                        />
                        <p className="mt-1 text-xs text-slate-400">
                            Available Balance: ${(Number(wallet?.balance || 0) + Number(wallet?.creditLimit || 0)).toLocaleString()}
                        </p>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button type="button" onClick={handleClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button type="button" onClick={() => setStep('pin')} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                            Proceed
                        </button>
                    </div>
                </div>
            )}

            {step === 'pin' && (
                <PinKeypad
                    length={4}
                    value={pin}
                    onChange={(nextPin) => {
                        setPin(nextPin);
                        setError('');
                    }}
                    error={error}
                    title="Enter Wallet PIN"
                    onSubmit={(pin) =>
                        createOrder(
                            { listingId: listing.id, pin },
                            {
                                onSuccess: () => setStep('success'),
                                onError: (err) => setError(err.response?.data?.message || 'Payment failed'),
                            }
                        )
                    }
                    isSubmitting={isPending}
                    submitLabel="Proceed"
                />
            )}

            {step === 'success' && (
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">✓</div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">Payment Successful!</h3>
                    <p className="mt-1 text-sm text-slate-500">Your trade purchase has been completed successfully.</p>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/orders')}
                        className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        View Order
                    </button>
                </div>
            )}
        </Modal>
    );
}