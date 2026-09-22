'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuLoaderCircle } from 'react-icons/lu';
import Modal from '@/components/ui/Modal';
import { useMyListings } from '@/hooks/useListing';
import { useCreateBarterOffer } from '@/hooks/useBarter';

export default function BarterSwapModal({ open, onClose, targetListing }) {
    const [selectedId, setSelectedId] = useState(null);
    const [sent, setSent] = useState(false);
    const { data: myListings, isLoading } = useMyListings();
    const { mutate: sendOffer, isPending } = useCreateBarterOffer();
    const router = useRouter();

    const activeListings = (myListings || []).filter((l) => l.status === 'ACTIVE');

    const handleClose = () => {
        setSelectedId(null);
        setSent(false);
        onClose();
    };

    const handleSend = () => {
        sendOffer(
            { offererListingId: selectedId, targetListingId: targetListing.id },
            { onSuccess: () => setSent(true) }
        );
    };

    return (
        <Modal open={open} onClose={handleClose} title={sent ? undefined : 'Select Your Listing to Offer'}>
            {sent ? (
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">✓</div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">Barter Offer Sent!</h3>
                    <p className="mt-1 text-sm text-slate-500">Your offer has been sent to the seller. You'll be notified once they respond.</p>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/barter-offers')}
                        className="mt-5 w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        View My Offers
                    </button>
                </div>
            ) : (
                <>
                    {isLoading ? (
                        <p className="py-6 text-center text-sm text-slate-400">Loading your listings...</p>
                    ) : !activeListings.length ? (
                        <p className="py-6 text-center text-sm text-slate-400">
                            You need an active listing to make a barter offer.
                        </p>
                    ) : (
                        <div className="grid max-h-80 grid-cols-3 gap-3 overflow-y-auto">
                            {activeListings.map((listing) => (
                                <button
                                    key={listing.id}
                                    type="button"
                                    onClick={() => setSelectedId(listing.id)}
                                    className={`overflow-hidden cursor-pointer rounded-xl border-2 text-left transition ${selectedId === listing.id ? 'border-blue-600' : 'border-transparent'
                                        }`}
                                >
                                    <div className="aspect-square bg-slate-100">
                                        {listing.imageUrls?.[0] && (
                                            <img src={listing.imageUrls[0]} alt="" className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="p-1.5">
                                        <p className="truncate text-[11px] font-semibold text-slate-800">{listing.title}</p>
                                        <p className="text-[10px] text-slate-400">${Number(listing.price).toLocaleString()}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-5 flex gap-3">
                        <button type="button" onClick={handleClose} className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!selectedId || isPending}
                            className="flex flex-1 items-center cursor-pointer justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {isPending && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
                            Send Offer
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}