'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ListingForm from '@/components/listings/ListingForm';
import { useListingDetail, useUpdateListing, useDeleteListing } from '@/hooks/useListing';
import Loading from '@/components/ui/Loading';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import BackButton from '@/components/ui/BackButton';

export default function EditListingPage() {
    const { listingId } = useParams();
    const router = useRouter();
    const { data: listing, isLoading } = useListingDetail(listingId);
    const { mutate: updateListing, isPending } = useUpdateListing();
    const { mutate: removeListing, isPending: isDeleting } = useDeleteListing();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    if (isLoading) return <Loading />;
    if (!listing) return <p className="p-8 text-center text-sm text-slate-400">Listing not found.</p>;

    const handleSubmit = (data) => {
        updateListing({ listingId, data }, { onSuccess: () => router.push('/dashboard/listings') });
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        removeListing(listingId, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                router.push('/dashboard/listings');
            },
        });
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className='flex items-center justify-between' >
                <div>

                    <h2 className="mb-1 text-lg font-bold text-slate-900">Edit Listing</h2>
                    <p className="mb-5 text-sm text-slate-500">Update your listing details</p>
                </div>
                <BackButton handleBack={() => router.back()} title="Back to Listings" />
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <ListingForm defaultValues={listing} onSubmit={handleSubmit} isPending={isPending} submitLabel="Save Changes" />
                <button
                    type="button"
                    onClick={handleDelete}
                    className="mt-4 w-full cursor-pointer rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                >
                    Delete Listing
                </button>
            </div>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                type="delete"
                listingTitle={listing.title}
                isLoading={isDeleting}
            />
        </div>
    );
}