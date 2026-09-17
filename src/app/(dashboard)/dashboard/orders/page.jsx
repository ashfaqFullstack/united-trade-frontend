'use client';

import { useState } from 'react';
import Loading from '@/components/ui/Loading';
import OrderCard from '@/components/orders/OrderCard';
import OrderTabs from '@/components/orders/OrderTabs';
import { useMyOrders, useCompleteOrder, useCancelOrder } from '@/hooks/useOrder';

export default function MyOrdersPage() {
    const [tab, setTab] = useState('ALL');
    const { data: orders, isLoading } = useMyOrders();
    const { mutate: complete, isPending: completing, variables: completingId } = useCompleteOrder();
    const { mutate: cancel, isPending: cancelling, variables: cancellingId } = useCancelOrder();

    if (isLoading) return <Loading />;

    const filtered = (orders || []).filter((o) => tab === 'ALL' || o.status === tab);

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-slate-900">My Orders</h2>
                <p className="text-sm text-slate-500">Orders you've placed as a buyer</p>
            </div>

            <OrderTabs orders={orders || []} tab={tab} onChange={setTab} />

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                {!filtered.length ? (
                    <p className="py-10 text-center text-sm text-slate-400">No orders found.</p>
                ) : (
                    filtered.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            mode="buyer"
                            onComplete={complete}
                            onCancel={cancel}
                            isCompleting={completing && completingId === order.id}
                            isCancelling={cancelling && cancellingId === order.id}
                        />
                    ))
                )}
            </div>
        </div>
    );
}