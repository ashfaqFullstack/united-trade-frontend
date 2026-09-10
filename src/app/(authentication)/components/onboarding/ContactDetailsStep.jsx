'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuArrowRight, LuLoaderCircle } from 'react-icons/lu';
import { toast } from 'sonner';

import TextInput from './TextInput';
import { useCompleteBusinessProfile } from '@/hooks/useBusiness';

const schema = z.object({
    phone: z.string().min(1, 'Phone number is required'),
    secondaryContactName: z.string().optional(),
    secondaryContactPhone: z.string().optional(),
    secondaryContactEmail: z.string().optional(),
});

export default function ContactDetailsStep({ onNext }) {
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
            <TextInput label="Phone Number" required placeholder="0300 1234567" error={errors.phone?.message} {...register('phone')} />

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-medium text-slate-400">Secondary Contact (Optional)</p>
                <div className="space-y-4">
                    <TextInput label="Full Name" placeholder="Optional" {...register('secondaryContactName')} />
                    <TextInput label="Phone" placeholder="Optional" {...register('secondaryContactPhone')} />
                    <TextInput label="Email" placeholder="Optional" {...register('secondaryContactEmail')} />
                </div>
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