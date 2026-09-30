
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
    category: z.string().min(1, 'Please select an industry / category'),
    productsServices: z.string().min(1, 'Please describe the products or services you offer'),
    yearsInBusiness: z.coerce
        .number({ invalid_type_error: 'Enter the number of years' })
        .int('Enter a whole number')
        .min(0, 'Cannot be negative')
        .max(200, 'Please enter a valid number'),
});

export default function BusinessInfoStep({ onNext }) {
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
            <SelectInput label="Industry / Category" required options={BUSINESS_CATEGORIES} error={errors.category?.message} {...register('category')} />
            <TextInput label="Products or Services Offered" required textarea placeholder="Describe what your business offers" error={errors.productsServices?.message} {...register('productsServices')} />

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">Business Verification</p>
                <TextInput label="Years in Business" required type="number" min="0" placeholder="5" error={errors.yearsInBusiness?.message} {...register('yearsInBusiness')} />
            </div>

            <button type="submit" disabled={isPending} className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60">
                {isPending ?
                    <LuLoaderCircle className="h-5 w-5 animate-spin" />
                    : 'Continue'}
                {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </form>
    );
}