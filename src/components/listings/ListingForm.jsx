'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { LuArrowRight, LuLoaderCircle } from 'react-icons/lu';
import ListingImageUploader from './ListingImageUploader';
import TextInput from '@/components/ui/TextInput';
import SelectInput from '@/components/ui/SelectInput';
import { BUSINESS_CATEGORIES } from '@/const/const';
import { useAuthStore } from '@/store/useAuthStore';

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().positive('Enter a valid price'),
    category: z.string().min(1, 'Please select a category'),
});

export default function ListingForm({ defaultValues, onSubmit, isPending, submitLabel = 'Publish Listing' }) {
    const [imageUrls, setImageUrls] = useState(defaultValues?.imageUrls || []);
    const user = useAuthStore((state) => state.user);
    const [isPublic, setIsPublic] = useState(defaultValues?.isPublic ?? (user?.role === 'BUSINESS'));

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: defaultValues?.title || '',
            description: defaultValues?.description || '',
            price: defaultValues?.price || '',
            category: defaultValues?.category || '',
        },
    });

    const handleFormSubmit = (data) => {
        onSubmit({ ...data, price: Number(data.price), imageUrls, isPublic });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <TextInput label="Title" required placeholder="e.g. MacBook Pro 2021" error={errors.title?.message} {...register('title')} />
            <TextInput
                label="Description"
                required
                textarea
                placeholder="Describe your item, its condition, and any important details..."
                error={errors.description?.message}
                {...register('description')}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectInput
                    label="Category"
                    required
                    options={BUSINESS_CATEGORIES}
                    error={errors.category?.message}
                    {...register('category')}
                />
                <TextInput
                    label="Price (Trade Dollars)"
                    required
                    type="number"
                    placeholder="e.g. 250"
                    error={errors.price?.message}
                    {...register('price')}
                />
            </div>

            <ListingImageUploader value={imageUrls} onChange={setImageUrls} />

            {user?.role === 'CUSTOMER' && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                    <div>
                        <p className="text-sm font-medium text-slate-700">Make this listing public</p>
                        <p className="text-xs text-slate-400">
                            Public listings appear in the marketplace for everyone. Private listings are only visible to you (until someone offers a barter swap on it).
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsPublic((prev) => !prev)}
                        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition ${isPublic ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                        <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${isPublic ? 'left-5' : 'left-0.5'}`}
                        />
                    </button>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
                {isPending ?
                    <LuLoaderCircle className="h-5 w-5 animate-spin" />
                    : submitLabel}
                {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </form>
    );
}