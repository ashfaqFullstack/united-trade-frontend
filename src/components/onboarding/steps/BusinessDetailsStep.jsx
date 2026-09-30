
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuArrowRight, LuLoaderCircle } from 'react-icons/lu';
import { toast } from 'sonner';

import TextInput from '../../ui/TextInput';
import { useCompleteBusinessProfile } from '@/hooks/useBusiness';
import { useAuthStore } from '@/store/useAuthStore';
import CountrySelect from '@/components/ui/CountrySelect';

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
});

export default function BusinessDetailsStep({ onNext }) {
    const user = useAuthStore((state) => state.user);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const { mutate: saveStep, isPending } = useCompleteBusinessProfile();

    const onSubmit = (data) => {
        saveStep(data, {
            onSuccess: () => onNext(),
            onError: (error) => toast.error(error.response?.data?.message || 'Something went wrong'),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* From the account — not editable here */}
            <TextInput label="Full Name" value={user?.name || ''} readOnly disabled />

            <TextInput label="Business Name" required placeholder="Example Company" error={errors.businessName?.message} {...register('businessName')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="ACN" placeholder="9 digits (optional)" error={errors.acn?.message} {...register('acn')} />
                <TextInput label="ABN" placeholder="11 digits (optional)" error={errors.abn?.message} {...register('abn')} />
            </div>

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">Business Address</p>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <TextInput label="Number" required placeholder="12" error={errors.streetNumber?.message} {...register('streetNumber')} />
                        <div className="sm:col-span-2">
                            <TextInput label="Street Name" required placeholder="Main Street" error={errors.streetName?.message} {...register('streetName')} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <TextInput label="City" required placeholder="Sydney" error={errors.city?.message} {...register('city')} />
                        <TextInput label="State" required placeholder="NSW" error={errors.state?.message} {...register('state')} />
                        <TextInput label="Post/Zip Code" required placeholder="2000" error={errors.postcode?.message} {...register('postcode')} />
                    </div>
                </div>
            </div>

            {/* <TextInput label="Country" required placeholder="Australia" error={errors.country?.message} {...register('country')} /> */}
            <CountrySelect label="Country" required error={errors.country?.message} {...register('country')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="Business Phone" required placeholder="02 1234 5678" error={errors.phone?.message} {...register('phone')} />
                <TextInput label="Cell/Mobile Number" required placeholder="0400 000 000" error={errors.mobile?.message} {...register('mobile')} />
            </div>
            <TextInput label="Email" value={user?.email || ''} readOnly disabled />
            <TextInput label="Website" placeholder="https://yourbusiness.com" error={errors.website?.message} {...register('website')} />
            <TextInput label="Social Media Links" textarea placeholder="Facebook, Instagram, LinkedIn... (one per line)" {...register('socialLinks')} />

            <button type="submit" disabled={isPending} className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60">
                {isPending ?
                    <LuLoaderCircle className="h-5 w-5 animate-spin" />
                    : 'Continue'}
                {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </form>
    );
}