'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuArrowRight } from 'react-icons/lu';
import { toast } from 'sonner';

import TextInput from './TextInput';
import SelectInput from './SelectInput';
import { BUSINESS_CATEGORIES } from '@/const/const';
import { useCompleteBusinessProfile } from '@/hooks/useBusiness';

const schema = z.object({
    businessName: z.string().min(1, 'Business name is required'),
    category: z.string().min(1, 'Please select a category'),
    phone: z.string().min(1, 'Phone number is required'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    address: z.string().optional(),
});

export default function BusinessDetailsStep({ onNext }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const { mutate: completeProfile, isPending } = useCompleteBusinessProfile();

    const onSubmit = (data) => {
        completeProfile(data, {
            onSuccess: () => onNext(),
            onError: (error) => toast.error(error.response?.data?.message || 'Something went wrong'),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInput
                label="Business Name"
                required
                placeholder="e.g. Acme Trading Co."
                error={errors.businessName?.message}
                {...register('businessName')}
            />
            <SelectInput
                label="Business Category"
                required
                options={BUSINESS_CATEGORIES}
                error={errors.category?.message}
                {...register('category')}
            />
            <TextInput
                label="Phone Number"
                required
                placeholder="e.g. +[country code] [phone number]"
                error={errors.phone?.message}
                {...register('phone')}
            />
            <TextInput
                label="Country"
                required
                placeholder="e.g. United States"
                error={errors.country?.message}
                {...register('country')}
            />
            <TextInput label="City" required placeholder="e.g. New York" error={errors.city?.message} {...register('city')} />
            <TextInput label="Address" placeholder="e.g. 123 Market Street" {...register('address')} />

            <button
                type="submit"
                disabled={isPending}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
                {isPending ? 'Saving...' : 'Continue'}
                {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </form>
    );
}