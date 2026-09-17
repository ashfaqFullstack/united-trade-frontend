'use client';

import { useState } from 'react';
import Loading from '@/components/ui/Loading';
import { useMyBarterOffers } from '@/hooks/useBarter';
import BarterOfferCard from '@/components/barter/BarteOfferCard';

const TABS = ['All', 'Pending', 'Accepted', 'Rejected', 'Cancelled'];

export default function MyBarterOffersPage() {
    const [tab, setTab] = useState('All');
    const { data: offers, isLoading } = useMyBarterOffers();

    if (isLoading) return <Loading />;

    const filtered = (offers || []).filter((o) => tab === 'All' || o.status.toLowerCase() === tab.toLowerCase());

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-slate-900">My Barter Offers</h2>
                <p className="text-sm text-slate-500">Offers you've sent to other users</p>
            </div>

            <div className="flex gap-2 overflow-x-auto">
                {TABS.map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition ${tab === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                    >
                        {t} ({t === 'All' ? offers?.length || 0 : (offers || []).filter((o) => o.status.toLowerCase() === t.toLowerCase()).length})
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                {!filtered.length ? (
                    <p className="py-10 text-center text-sm text-slate-400">No offers found.</p>
                ) : (
                    filtered.map((offer) => (
                        <BarterOfferCard
                            key={offer.id}
                            offer={offer}
                        />
                    ))
                )}
            </div>
        </div>
    );
}