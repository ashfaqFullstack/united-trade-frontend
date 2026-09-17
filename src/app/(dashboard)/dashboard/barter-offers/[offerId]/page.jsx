'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiCalendar, FiCheckCircle, FiPackage, FiUser } from 'react-icons/fi';
import Loading from '@/components/ui/Loading';
import StatusBadge from '@/components/ui/StatusBadge';
import { useAcceptBarterOffer, useCancelBarterOffer, useBarterOfferDetail, useRejectBarterOffer } from '@/hooks/useBarter';
import BackButton from '@/components/ui/BackButton';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useAuthStore } from '@/store/useAuthStore';

function ListingPanel({ label, listing }) {
    const image = listing?.imageUrls?.[0];

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
            <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                    {image ? <img src={image} alt={listing?.title || ''} className="h-full w-full object-cover" /> : (
                        <div className="flex h-full items-center justify-center text-slate-400"><FiPackage className="h-6 w-6" /></div>
                    )}
                </div>
                <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-slate-900">{listing?.title || 'Listing unavailable'}</h2>
                    <p className="mt-1 text-lg font-bold text-blue-600">${Number(listing?.price || 0).toLocaleString()}</p>
                    {listing?.description && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{listing.description}</p>}
                </div>
            </div>
        </div>
    );
}

function Person({ label, person }) {
    const name = person?.businessProfile?.businessName || person?.name || person?.username || 'Trade member';

    return (
        <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {name.slice(0, 2).toUpperCase()}
            </span>
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">{name}</p>
            </div>
        </div>
    );
}

export default function BarterOfferDetailPage() {
    const { offerId } = useParams();
    const router = useRouter();
    const { data: offer, isLoading } = useBarterOfferDetail(offerId);
    const [confirmation, setConfirmation] = useState(null);
    const { mutate: acceptOffer, isPending: accepting } = useAcceptBarterOffer();
    const { mutate: rejectOffer, isPending: rejecting } = useRejectBarterOffer();
    const { mutate: cancelOffer, isPending: cancelling } = useCancelBarterOffer();
    const currentUser = useAuthStore((state) => state.user);
    const isReceivedPending = offer?.status === 'PENDING' && offer?.targetOwnerId === currentUser?.id;
    const isSentPending = offer?.status === 'PENDING' && offer?.offererId === currentUser?.id;

    const confirmAction = () => {
        const mutation = confirmation === 'accept'
            ? acceptOffer
            : confirmation === 'reject'
                ? rejectOffer
                : cancelOffer;
        mutation(offer.id, { onSuccess: () => setConfirmation(null) });
    };

    if (isLoading) return <Loading />;

    if (!offer) {
        return (
            <div className="py-16 text-center">
                <h1 className="text-lg font-bold text-slate-900">Offer not found</h1>
                <p className="mt-1 text-sm text-slate-500">This offer may have been removed or is no longer available.</p>
                <Link href="/dashboard/barter-offers" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Back to offers</Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className='flex items-end justify-end' >
                <BackButton handleBack={() => router.back()} title="Back to offers" />
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Barter offer</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900">Offer details</h1>
                    <p className="mt-1 text-sm text-slate-500">Review the items and activity for this exchange.</p>
                </div>
                <StatusBadge status={offer.status} />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <ListingPanel label="Offered item" listing={offer.offererListing} />
                <div className="flex h-10 w-10 items-center justify-center self-center rounded-full bg-blue-600 text-white lg:mx-1">
                    <FiCheckCircle className="h-5 w-5" />
                </div>
                <ListingPanel label="Requested item" listing={offer.targetListing} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-100 bg-white p-5">
                    <h2 className="mb-4 text-sm font-bold text-slate-900">People involved</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Person label="Offer sent by" person={offer.offerer || offer.sender} />
                        <Person label="Offer sent to" person={offer.targetOwner || offer.receiver} />
                    </div>
                </section>
                <section className="rounded-2xl border border-slate-100 bg-white p-5">
                    <h2 className="mb-4 text-sm font-bold text-slate-900">Offer information</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-4 text-slate-500"><span className="flex items-center gap-2"><FiCalendar /> Created</span><strong className="text-slate-800">{new Date(offer.createdAt).toLocaleDateString()}</strong></div>
                        {/* <div className="flex items-center justify-between gap-4 text-slate-500"><span className="flex items-center gap-2"><FiUser /> Offer ID</span><strong className="max-w-48 truncate text-slate-800">{offer.id}</strong></div> */}
                    </div>
                </section>
            </div>

            {offer.message && (
                <section className="rounded-2xl border border-slate-100 bg-white p-5">
                    <h2 className="mb-2 text-sm font-bold text-slate-900">Message from the trader</h2>
                    <p className="text-sm leading-relaxed text-slate-600">{offer.message}</p>
                </section>
            )}

            {isReceivedPending && (
                <div className="flex flex-wrap justify-end gap-3">
                    <button type="button" onClick={() => setConfirmation('reject')} className="cursor-pointer rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">Reject Offer</button>
                    <button type="button" onClick={() => setConfirmation('accept')} className="cursor-pointer rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">Accept Offer</button>
                </div>
            )}

            {isSentPending && (
                <div className="flex justify-end">
                    <button type="button" onClick={() => setConfirmation('cancel')} className="cursor-pointer rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">Cancel Offer</button>
                </div>
            )}

            <ConfirmationModal
                isOpen={Boolean(confirmation)}
                onClose={() => setConfirmation(null)}
                onConfirm={confirmAction}
                type={confirmation || 'accept'}
                listingTitle={offer.targetListing?.title || 'this listing'}
                isLoading={accepting || rejecting || cancelling}
            />
        </div>
    );
}