'use client';

import { useRouter } from 'next/navigation';
import ListingForm from '@/components/listings/ListingForm';
import { useCreateListing } from '@/hooks/useListing';

export default function NewListingPage() {
    const router = useRouter();
    const { mutate: createListing, isPending } = useCreateListing();

    const handleSubmit = (data) => {
        createListing(data, { onSuccess: () => router.push('/dashboard/listings') });
    };

    return (
        <div className="mx-auto max-w-2xl">
            <h2 className="mb-1 text-lg font-bold text-slate-900">Create New Listing</h2>
            <p className="mb-5 text-sm text-slate-500">Add details about your item, service, or product</p>
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <ListingForm onSubmit={handleSubmit} isPending={isPending} />
            </div>
        </div>
    );
}