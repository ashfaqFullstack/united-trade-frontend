'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuUser,
    LuMail,
    LuLock,
    LuArrowLeft,
    LuArrowRight,
} from 'react-icons/lu';

import FormField from './FormField';
import SocialButton from './SocialButton';
import RoleToggle from './RoleToggle';
import { useRegister } from '@/hooks/useAuth';
import { toast } from 'sonner';

const registerSchema = z
    .object({
        name: z.string().min(1, 'Full name is required'),
        email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
        password: z.string().min(8, 'Must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export default function RegisterForm() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('CUSTOMER');

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({ resolver: zodResolver(registerSchema) });

    const { mutate: registerUser, isPending } = useRegister();

    const handleNext = () => {
        if (!role) return;
        setStep(2);
    };

    const handleBack = () => setStep(1);

    const onSubmit = (data) => {
        registerUser(
            { name: data.name, email: data.email, password: data.password, role },
            {
                onError: (error) => {
                    const message = error.response?.data?.message || 'Registration failed';
                    setError('root', { message });
                    toast.error(message);
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="mb-1 flex items-center justify-between gap-3">
                <div className="flex items-center  gap-2">
                    <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${step >= 1
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                            }`}
                    >
                        {step}
                    </div>

                    <span className="text-md md:text-lg font-semibold text-slate-800">
                        {step === 1 ? 'Account Type' : 'Account Details'}
                    </span>
                </div>
                {step === 2 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="group mb-1 inline-flex items-center gap-2 rounded-full bg-indigo-600 pl-2 pr-4 md:px-4 py-1 md:py-2.5 text-sm cursor-pointer text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
                    >
                        <LuArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                        Back
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait" initial={false}>
                {step === 1 ? (
                    <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: -25 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -25 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="flex h-full min-h-[30vh] md:min-h-[360px] flex-col"
                    >
                        <RoleToggle role={role} setRole={setRole} />

                        <button
                            type="button"
                            onClick={handleNext}
                            className="group mt-auto cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:opacity-95 hover:shadow-lg active:scale-[0.99]"
                        >
                            Continue
                            <LuArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 25 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="space-y-4"
                    >
                        <FormField
                            label="Full Name"
                            icon={LuUser}
                            placeholder="Enter your full name"
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <FormField
                            label="Email Address"
                            icon={LuMail}
                            placeholder="Enter your email"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <FormField
                            label="Password"
                            icon={LuLock}
                            isPassword
                            hint="Must be at least 8 characters"
                            placeholder="Create a password"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <FormField
                            label="Confirm Password"
                            icon={LuLock}
                            isPassword
                            placeholder="Confirm your password"
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        <button
                            type="submit"
                            disabled={isPending}
                            className="group cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? 'Creating account...' : 'Create Account'}
                            {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}