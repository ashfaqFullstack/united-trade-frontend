'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuLoaderCircle } from 'react-icons/lu';
import { useCustomerProfile, useUpdateCustomerProfile } from '@/hooks/useCustomer';
import Loading from '@/components/ui/Loading';
import TextInput from '@/components/ui/TextInput';

const schema = z.object({
    phone: z.string().min(1, 'Phone number is required'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    address: z.string().optional(),
});

export default function CustomerProfileEditForm({ onCancel, onSaved }) {
    const { data: profile, isLoading } = useCustomerProfile();
    const { mutate: saveProfile, isPending } = useUpdateCustomerProfile();

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
            <TextInput label="Phone Number" required error={errors.phone?.message} {...register('phone')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="Country" required error={errors.country?.message} {...register('country')} />
                <TextInput label="City" required error={errors.city?.message} {...register('city')} />
            </div>
            <TextInput label="Address" {...register('address')} />

            <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center cursor-pointer gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
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