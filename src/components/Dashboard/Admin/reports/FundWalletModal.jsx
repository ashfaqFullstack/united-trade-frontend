'use client';

import { useState } from 'react';
import { LuLoaderCircle } from 'react-icons/lu';
import { useFundAdminWallet } from '@/hooks/useAdmin';
import Modal from '@/components/ui/Modal';

export default function FundWalletModal({ open, onClose, companyBalance }) {
    const [amount, setAmount] = useState('');
    const { mutate: fundWallet, isPending } = useFundAdminWallet();

    const handleClose = () => {
        setAmount('');
        onClose();
    };

    const handleSubmit = () => {
        const value = Number(amount);
        if (!value || value <= 0) return;
        fundWallet(value, { onSuccess: handleClose });
    };

    return (
        <Modal open={open} onClose={handleClose} title="Fund My Wallet">
            <p className="text-sm text-slate-500">
                Transfer trade dollars from the Company Account into your personal wallet, so you can purchase
                listings on the marketplace.
            </p>

            <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Amount</label>
                <input
                    type="number"
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border text-black border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-xs text-slate-400">
                    Available in Company Account: ${Number(companyBalance ?? 0).toLocaleString()}
                </p>
            </div>

            <div className="mt-6 flex gap-3">
                <button type="button" onClick={handleClose} className="cursor-pointer flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isPending || !amount}
                    className="flex flex-1 items-center justify-center gap-2 cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {isPending && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
                    Confirm Transfer
                </button>
            </div>
        </Modal>
    );
}