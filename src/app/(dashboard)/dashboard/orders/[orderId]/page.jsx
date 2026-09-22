'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiCheck } from 'react-icons/fi';
import { LuLoaderCircle } from 'react-icons/lu';
import Loading from '@/components/ui/Loading';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useMyOrders, useReceivedOrders, useCompleteOrder, useCancelOrder } from '@/hooks/useOrder';
import BackButton from '@/components/ui/BackButton';

const STEPS = ['ESCROW_HELD', 'COMPLETED'];

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const { data: orders, isLoading } = useMyOrders();
    const { data: receivedOrders, isLoading: receivedOrdersLoading } = useReceivedOrders();
    const { mutate: complete, isPending: completing } = useCompleteOrder();
    const { mutate: cancel, isPending: cancelling } = useCancelOrder();
    const [confirmAction, setConfirmAction] = useState(null);

    if (isLoading || receivedOrdersLoading) return <Loading />;

    const order = [...(orders || []), ...(receivedOrders || [])].find((o) => o.id === orderId);
    if (!order) return <p className="p-8 text-center text-sm text-slate-400">Order not found.</p>;

    const isCancelled = order.status === 'CANCELLED';
    const activeStepIndex = isCancelled ? -1 : STEPS.indexOf(order.status);

    const submitConfirm = () => {
        if (!confirmAction) return;

        if (confirmAction === 'complete') {
            complete(order.id);
        }

        if (confirmAction === 'cancel') {
            cancel(order.id);
        }

        setConfirmAction(null);
    };

    return (
        <div className="mx-auto max-w-3xl space-y-5">
            <BackButton handleBack={() => router.back()} title="Back" />

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                            {order.listing?.imageUrls?.[0] && (
                                <img src={order.listing.imageUrls[0]} alt="" className="h-full w-full object-cover" />
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">{order.listing?.title}</p>
                            <p className="text-sm text-slate-400">${Number(order.amount).toLocaleString()} Trade Value</p>
                        </div>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                {order.status === 'ESCROW_HELD' && (
                    <div className="mt-5 flex gap-3">
                        {/* <button
                            type="button"
                            onClick={() => setConfirmAction('complete')}
                            disabled={completing || cancelling}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {completing ? <LuLoaderCircle className="h-5 w-5 animate-spin" /> : <FiCheck className="h-4 w-4" />}
                            Mark as Complete
                        </button> */}
                        <button
                            type="button"
                            onClick={() => setConfirmAction('cancel')}
                            disabled={completing || cancelling}
                            className="flex flex-1 items-center cursor-pointer justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                        >
                            {cancelling && <LuLoaderCircle className="h-5 w-5 animate-spin" />}
                            Cancel Order
                        </button>
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Order Timeline</h3>
                <div className="flex items-center">
                    {['Ordered', 'Escrow Held', isCancelled ? 'Cancelled' : 'Completed'].map((label, i) => {
                        const stepDone = isCancelled ? i === 2 : i <= activeStepIndex + 1;
                        return (
                            <div key={label} className="flex flex-1 items-center">
                                <div className="flex flex-col items-center gap-1.5">
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${stepDone
                                            ? isCancelled && i === 2
                                                ? 'bg-red-500 text-white'
                                                : 'bg-blue-600 text-white'
                                            : 'bg-slate-100 text-slate-400'
                                            }`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className="text-center text-[11px] font-medium text-slate-500">{label}</span>
                                </div>
                                {i < 2 && <div className={`mx-2 h-0.5 flex-1 ${stepDone ? 'bg-blue-600' : 'bg-slate-100'}`} />}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Order Information</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-xs text-slate-400">Buyer</dt>
                        <dd className="font-medium text-slate-800">{order.buyer?.name || 'You'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-slate-400">Seller</dt>
                        <dd className="font-medium text-slate-800">{order.seller?.name}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-slate-400">Total Amount</dt>
                        <dd className="font-medium text-slate-800">${Number(order.amount).toLocaleString()}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-slate-400">Date</dt>
                        <dd className="font-medium text-slate-800">{new Date(order.createdAt).toLocaleString()}</dd>
                    </div>
                </dl>
            </div>

            <ConfirmationModal
                isOpen={Boolean(confirmAction)}
                type={confirmAction === 'complete' ? 'complete' : 'cancel'}
                listingTitle={order.listing?.title || 'this order'}
                onClose={() => setConfirmAction(null)}
                onConfirm={submitConfirm}
                isLoading={confirmAction === 'complete' ? completing : cancelling}
            />
        </div>
    );
}