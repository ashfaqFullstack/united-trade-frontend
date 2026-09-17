'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import { useMyListings, useUpdateListing, useDeleteListing } from '@/hooks/useListing';
import ListingCard from './ListingCard';
import Loading from '@/components/ui/Loading';

const TABS = ['All', 'Active', 'Paused'];

export default function MyListingsGrid() {
    const [tab, setTab] = useState('All');
    const { data: listings, isLoading } = useMyListings();
    const { mutate: updateListing } = useUpdateListing();
    const { mutate: removeListing } = useDeleteListing();

    const filtered = (listings || []).filter((l) => {
        if (tab === 'Active') return l.status === 'ACTIVE';
        if (tab === 'Paused') return l.status === 'PAUSED';
        return true;
    });

    const handlePauseToggle = (listing) => {
        updateListing({
            listingId: listing.id,
            data: { status: listing.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' },
        });
    };

    const handleDelete = (listing) => {
        removeListing(listing.id);
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">My Listings</h2>
                    <p className="text-sm text-slate-500">Manage your products and services</p>
                </div>
                <Link
                    href="/dashboard/listings/new"
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    <FiPlus className="h-4 w-4" />
                    Add New Listing
                </Link>
            </div>

            <div className="flex gap-2 rounded-full bg-slate-100 p-1" style={{ width: 'fit-content' }}>
                {TABS.map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition ${tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                            }`}
                    >
                        {t} ({t === 'All' ? listings?.length || 0 : (listings || []).filter((l) => (t === 'Active' ? l.status === 'ACTIVE' : l.status === 'PAUSED')).length})
                    </button>
                ))}
            </div>

            {isLoading ? (
                <Loading />
            ) : !filtered.length ? (
                <p className="py-10 text-center text-sm text-slate-400">No listings found.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {filtered.map((listing) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            mode="owner"
                            onPauseToggle={handlePauseToggle}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}