'use client';

import Modal from '@/app/components/ui/Modal';
import { useState } from 'react';

export default function ApproveModal({ open, onClose, onConfirm, isPending }) {
    const [creditLimit, setCreditLimit] = useState('');

    return (
        <Modal open={open} onClose={onClose} title="Approve this user?">
            <p className="text-sm text-slate-500">
                This will activate their account and create a wallet with a starting credit limit.
            </p>

            <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Starting Credit Limit</label>
                <input
                    type="number"
                    placeholder="1000 (default)"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onConfirm(creditLimit ? Number(creditLimit) : undefined)}
                    className="flex-1 cursor-pointer rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                    {isPending ? 'Approving...' : 'Confirm Approve'}
                </button>
            </div>
        </Modal>
    );
}