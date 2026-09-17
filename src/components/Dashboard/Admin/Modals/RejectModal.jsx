'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { LuLoaderCircle } from 'react-icons/lu';


export default function RejectModal({ open, onClose, onConfirm, isPending }) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (!reason.trim()) return;
        onConfirm(reason.trim());
    };

    return (
        <Modal open={open} onClose={onClose} title="Reject this application?">
            <p className="text-sm text-slate-500">
                Please provide a reason — this will be sent to the applicant via email.
            </p>

            <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Reason for Rejection</label>
                <textarea
                    rows={3}
                    placeholder="e.g. Documents were unclear or incomplete"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {!reason.trim() && <p className="mt-1 text-xs text-slate-400">Reason is required.</p>}
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
                    disabled={isPending || !reason.trim()}
                    onClick={handleConfirm}
                    className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                    {isPending ?
                        <LuLoaderCircle className="h-5 w-5 animate-spin" />
                        : 'Confirm Reject'}
                </button>
            </div>
        </Modal>
    );
}