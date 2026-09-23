'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import StatusBadge from '@/components/ui/StatusBadge';

function ListingThumb({ listing }) {
    return (
        <div className="flex items-center gap-2">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {listing?.imageUrls?.[0] && <img src={listing.imageUrls[0]} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">{listing?.title}</p>
                <p className="text-[11px] text-slate-400">${Number(listing?.price || 0).toLocaleString()}</p>
            </div>
        </div>
    );
}

export default function BarterOfferCard({ offer, mode = 'sent' }) {
    const detailHref = `/dashboard/barter-offers/${offer.id}${mode === 'received' ? '?from=received' : ''}`;

    return (
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
            <ListingThumb listing={offer.offererListing} />
            <FiArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
            <ListingThumb listing={offer.targetListing} />

            <div className="ml-auto flex items-center gap-3">
                <div className="text-right">
                    <StatusBadge status={offer.status} />
                    <p className="mt-1 text-[11px] text-slate-400">{new Date(offer.createdAt).toLocaleDateString()}</p>
                </div>

                <Link href={detailHref} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    View Details
                </Link>
            </div>
        </div>
    );
}