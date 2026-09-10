'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuArrowRight, LuLoaderCircle } from 'react-icons/lu';
import { toast } from 'sonner';

import TextInput from '../../ui/TextInput';
import SelectInput from '../../ui/SelectInput';
import { useCompleteBusinessProfile } from '@/hooks/useBusiness';
import { BUSINESS_CATEGORIES } from '@/const/const';

const schema = z.object({
    businessName: z.string().min(1, 'Business name is required'),
    tradingName: z.string().optional(),
    businessRegistrationNumber: z.string().optional(),
    category: z.string().min(1, 'Please select a category'),
    website: z.string().optional(),
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

    const { mutate: saveStep, isPending } = useCompleteBusinessProfile();

    const onSubmit = (data) => {
        saveStep(data, {
            onSuccess: () => onNext(),
            onError: (error) => toast.error(error.response?.data?.message || 'Something went wrong'),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInput label="Business Name" required placeholder="e.g. Ali Traders" error={errors.businessName?.message} {...register('businessName')} />
            <TextInput label="Trading Name (if different)" placeholder="Optional" {...register('tradingName')} />
            <TextInput label="Business Registration Number" placeholder="Optional" {...register('businessRegistrationNumber')} />
            <SelectInput label="Business Category" required options={BUSINESS_CATEGORIES} error={errors.category?.message} {...register('category')} />
            <TextInput label="Country" required placeholder="Pakistan" error={errors.country?.message} {...register('country')} />
            <TextInput label="Website" placeholder="https://yourbusiness.com" {...register('website')} />
            <TextInput label="City" required placeholder="Faisalabad" error={errors.city?.message} {...register('city')} />
            <TextInput label="Address" placeholder="Main Market, Street 5" {...register('address')} />

            <button type="submit" disabled={isPending} className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60">
                {isPending ?
                    <LuLoaderCircle className="h-5 w-5 animate-spin" />
                    : 'Continue'}
                {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </form>
    );
}