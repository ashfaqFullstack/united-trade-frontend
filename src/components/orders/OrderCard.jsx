'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LuLoaderCircle } from 'react-icons/lu';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import StatusBadge from '@/components/ui/StatusBadge';
// import { formatAddress } from '@/lib/formatAddress';

export default function OrderCard({ order, mode = 'buyer', onComplete, onCancel, isCompleting, isCancelling }) {
    const counterpart = mode === 'buyer' ? order.seller : order.buyer;
    const image = order.listing?.imageUrls?.[0];
    const [confirmAction, setConfirmAction] = useState(null);

    const openConfirm = (type) => setConfirmAction(type);
    const closeConfirm = () => setConfirmAction(null);

    const handleConfirm = () => {
        if (!confirmAction) return;

        if (confirmAction === 'complete') {
            onComplete?.(order.id);
        }

        if (confirmAction === 'cancel') {
            onCancel?.(order.id);
        }

        closeConfirm();
    };

    return (
        <>
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {image ? (
                        <img src={image} alt={order.listing?.title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-slate-300">No image</div>
                    )}
                </div>

                <div className="min-w-[160px] flex-1">
                    <p className="text-sm font-semibold text-slate-900">{order.listing?.title}</p>
                    <p className="text-xs text-slate-400">
                        {mode === 'buyer' ? 'Seller' : 'Buyer'}: {counterpart?.name}
                    </p>
                    <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                {/* <div className="min-w-[160px] flex-1">
                    <p className="text-sm font-semibold text-slate-900">{order.listing?.title}</p>
                    <p className="text-xs text-slate-400">
                        {mode === 'buyer' ? 'Seller' : 'Buyer'}: {counterpart?.name}
                    </p>
                    {formatAddress(counterpart) && (
                        <p className="text-xs text-slate-400">📍 {formatAddress(counterpart)}</p>
                    )}
                    <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div> */}

                <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">${Number(order.amount).toLocaleString()}</p>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Trade Value</p>
                </div>

                <StatusBadge status={order.status} />

                {mode === 'buyer' && order.status === 'ESCROW_HELD' ? (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => openConfirm('complete')}
                            disabled={isCompleting || isCancelling}
                            className="flex items-center cursor-pointer gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {isCompleting && <LuLoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                            Mark as Complete
                        </button>
                        <button
                            type="button"
                            onClick={() => openConfirm('cancel')}
                            disabled={isCompleting || isCancelling}
                            className="flex items-center cursor-pointer gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                        >
                            {isCancelling && <LuLoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                            Cancel Order
                        </button>
                    </div>
                ) : (
                    <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        View Details
                    </Link>
                )}
            </div>

            <ConfirmationModal
                isOpen={Boolean(confirmAction)}
                type={confirmAction === 'complete' ? 'complete' : 'cancel'}
                listingTitle={order.listing?.title || 'this order'}
                onClose={closeConfirm}
                onConfirm={handleConfirm}
                isLoading={confirmAction === 'complete' ? isCompleting : isCancelling}
            />
        </>
    );
}