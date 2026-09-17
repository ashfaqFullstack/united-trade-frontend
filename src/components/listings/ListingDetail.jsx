'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiMapPin, FiUsers } from 'react-icons/fi';
import { useListingDetail } from '@/hooks/useListing';
import Loading from '@/components/ui/Loading';
import BackButton from '@/components/ui/BackButton';
import { useRouter } from 'next/navigation';
import TradeNowModal from './TradeNowModal';
import BarterSwapModal from './BarterSwapModal';

export default function ListingDetail() {
    const { listingId } = useParams();
    const router = useRouter()
    const { data: listing, isLoading } = useListingDetail(listingId);
    const [activeImage, setActiveImage] = useState(0);
    const [tradeModalOpen, setTradeModalOpen] = useState(false);
    const [barterModalOpen, setBarterModalOpen] = useState(false);

    if (isLoading) return <div className='min-h-[65vh] flex items-center justify-center'>
        <Loading />
    </div>
    if (!listing) return <p className="p-10 text-center text-sm text-slate-400">Listing not found.</p>;

    const images = listing.imageUrls?.length ? listing.imageUrls : [];
    const sellerName = listing.business?.businessProfile?.businessName || listing.business?.name;
    const location = [listing.business?.businessProfile?.city, listing.business?.businessProfile?.country]
        .filter(Boolean)
        .join(', ');

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <div className='flex w-full items-end justify-end' >
                <BackButton handleBack={() => router.push('/marketplace')} title="Back to Marketplace" />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                    <div className="aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                        {images[activeImage] ? (
                            <img src={images[activeImage]} alt={listing.title} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-slate-300">No image</div>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="mt-3 flex gap-2">
                            {images.map((img, i) => (
                                <button
                                    key={img}
                                    type="button"
                                    onClick={() => setActiveImage(i)}
                                    className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${activeImage === i ? 'border-blue-600' : 'border-transparent'
                                        }`}
                                >
                                    <img src={img} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
                        <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${listing.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                }`}
                        >
                            {listing.status === 'ACTIVE' ? 'Active' : 'Paused'}
                        </span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-blue-600">${Number(listing.price).toLocaleString()}</p>

                    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5">
                        <h3 className="mb-2 text-sm font-bold text-slate-900">Description</h3>
                        <p className="text-sm leading-relaxed text-slate-600">{listing.description}</p>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5">
                        <h3 className="mb-3 text-sm font-bold text-slate-900">Seller Information</h3>
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                                {sellerName?.slice(0, 2)?.toUpperCase()}
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{sellerName}</p>
                                {location && (
                                    <p className="flex items-center gap-1 text-xs text-slate-400">
                                        <FiMapPin className="h-3 w-3" />
                                        {location}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => setTradeModalOpen(true)}
                                className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Trade Now
                            </button>
                            <button
                                type="button"
                                onClick={() => setBarterModalOpen(true)}
                                className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl border border-blue-600 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                            >
                                Offer a Barter Swap
                            </button>
                        </div>

                        <TradeNowModal open={tradeModalOpen} onClose={() => setTradeModalOpen(false)} listing={listing} />
                        <BarterSwapModal open={barterModalOpen} onClose={() => setBarterModalOpen(false)} targetListing={listing} />
                    </div>
                </div>
            </div>
        </div>
    );
}