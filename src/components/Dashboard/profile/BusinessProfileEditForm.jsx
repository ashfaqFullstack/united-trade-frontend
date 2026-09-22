'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuLoaderCircle } from 'react-icons/lu';
import { useBusinessProfile, useCompleteBusinessProfile } from '@/hooks/useBusiness';
import { BUSINESS_CATEGORIES } from '@/const/const';
import SelectInput from '@/components/ui/SelectInput';
import TextInput from '@/components/ui/TextInput';
import Loading from '@/components/ui/Loading';

const schema = z.object({
    businessName: z.string().min(1, 'Business name is required'),
    tradingName: z.string().optional(),
    businessRegistrationNumber: z.string().optional(),
    category: z.string().min(1, 'Please select a category'),
    website: z.string().optional(),
    phone: z.string().min(1, 'Phone number is required'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    address: z.string().optional(),
    secondaryContactName: z.string().optional(),
    secondaryContactPhone: z.string().optional(),
    secondaryContactEmail: z.string().optional(),
});

export default function BusinessProfileEditForm({ onCancel, onSaved }) {
    const { data: profile, isLoading } = useBusinessProfile();
    const { mutate: saveProfile, isPending } = useCompleteBusinessProfile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (profile) reset(profile);
    }, [profile, reset]);

    if (isLoading) return <Loading />;

    const onSubmit = (data) => saveProfile(data, { onSuccess: onSaved });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInput label="Business Name" required error={errors.businessName?.message} {...register('businessName')} />
            <TextInput label="Trading Name" {...register('tradingName')} />
            <TextInput label="Business Registration Number" {...register('businessRegistrationNumber')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectInput label="Category" required options={BUSINESS_CATEGORIES} error={errors.category?.message} {...register('category')} />
                <TextInput label="Website" {...register('website')} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="Phone Number" required error={errors.phone?.message} {...register('phone')} />
                <TextInput label="Country" required error={errors.country?.message} {...register('country')} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="City" required error={errors.city?.message} {...register('city')} />
                <TextInput label="Address" {...register('address')} />
            </div>

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-semibold text-slate-400">Secondary Contact (Optional)</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <TextInput label="Name" {...register('secondaryContactName')} />
                    <TextInput label="Phone" {...register('secondaryContactPhone')} />
                    <TextInput label="Email" {...register('secondaryContactEmail')} />
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="flex items-center cursor-pointer justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
                {isPending && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
                Save Changes
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="ml-3 cursor-pointer rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
                Cancel
            </button>
        </form>
    );
}