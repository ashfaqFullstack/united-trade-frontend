
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuLoaderCircle } from 'react-icons/lu';
import { useBusinessProfile, useCompleteBusinessProfile } from '@/hooks/useBusiness';
import { BUSINESS_CATEGORIES } from '@/const/const';
import SelectInput from '@/components/ui/SelectInput';
import TextInput from '@/components/ui/TextInput';
import Loading from '@/components/ui/Loading';
import { useSubmitProfileUpdate } from '@/hooks/useProfileUpdate';
import BusinessDocumentsManager from './BusinessDocumentManager';

const digitsOnly = z.string().regex(/^[0-9 ]*$/, 'Only digits and spaces are allowed').optional();

const schema = z.object({
    businessName: z.string().min(1, 'Business name is required'),
    acn: digitsOnly,
    abn: digitsOnly,
    streetNumber: z.string().min(1, 'Number is required'),
    streetName: z.string().min(1, 'Street name is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postcode: z.string().min(1, 'Post/Zip code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().min(1, 'Business phone is required'),
    mobile: z.string().min(1, 'Mobile number is required'),
    website: z
        .string()
        .optional()
        .refine((v) => !v || /^https?:\/\//i.test(v), 'Enter a full URL starting with http:// or https://'),
    socialLinks: z.string().optional(),
    category: z.string().min(1, 'Please select an industry / category'),
    productsServices: z.string().min(1, 'Please describe the products or services you offer'),
    yearsInBusiness: z.coerce.number().int('Enter a whole number').min(0, 'Cannot be negative').max(200),
});

export default function BusinessProfileEditForm({ onCancel, onSaved }) {
    const { data: profile, isLoading } = useBusinessProfile();
    // const { mutate: saveProfile, isPending } = useCompleteBusinessProfile();
    const { mutate: submitUpdate, isPending } = useSubmitProfileUpdate();
    const [documentChanges, setDocumentChanges] = useState({
        documentsToAdd: [],
        documentIdsToRemove: [],
    });

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

    const onSubmit = (data) => {
        submitUpdate({ proposedData: data, ...documentChanges }, { onSuccess: () => onSaved?.() });
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInput label="Business Name" required error={errors.businessName?.message} {...register('businessName')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="ACN" error={errors.acn?.message} {...register('acn')} />
                <TextInput label="ABN" error={errors.abn?.message} {...register('abn')} />
            </div>

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-semibold text-slate-400">Business Address</p>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <TextInput label="Number" required error={errors.streetNumber?.message} {...register('streetNumber')} />
                        <div className="sm:col-span-2">
                            <TextInput label="Street Name" required error={errors.streetName?.message} {...register('streetName')} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <TextInput label="City" required error={errors.city?.message} {...register('city')} />
                        <TextInput label="State" required error={errors.state?.message} {...register('state')} />
                        <TextInput label="Post/Zip Code" required error={errors.postcode?.message} {...register('postcode')} />
                    </div>
                </div>
            </div>

            {/* <TextInput label="Country" required error={errors.country?.message} {...register('country')} /> */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="Business Phone" required error={errors.phone?.message} {...register('phone')} />
                <TextInput label="Cell/Mobile Number" required error={errors.mobile?.message} {...register('mobile')} />
            </div>
            <TextInput label="Website" error={errors.website?.message} {...register('website')} />
            <TextInput label="Social Media Links" textarea {...register('socialLinks')} />

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-semibold text-slate-400">Business Information</p>
                <div className="space-y-4">
                    <SelectInput label="Industry / Category" required options={BUSINESS_CATEGORIES} error={errors.category?.message} {...register('category')} />
                    <TextInput label="Products or Services Offered" required textarea error={errors.productsServices?.message} {...register('productsServices')} />
                    <TextInput label="Years in Business" required type="number" min="0" error={errors.yearsInBusiness?.message} {...register('yearsInBusiness')} />
                </div>
            </div>

            <BusinessDocumentsManager existingDocuments={profile?.documents} onChange={setDocumentChanges} />

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    {isPending && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
                    Submit for Review
                </button>
            </div>
        </form>
    );
}