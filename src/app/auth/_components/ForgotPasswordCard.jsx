'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LuMail, LuLock, LuArrowLeft, LuArrowRight, LuKeyRound } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

import SidePanel from './SidePanel';
import FormField from './FormField';
import { useForgotPassword, useResetPassword } from '@/hooks/useAuth';
import Link from 'next/link';

const emailSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

const resetSchema = z
    .object({
        otp: z.string().length(6, 'OTP must be 6 digits'),
        newPassword: z.string().min(8, 'Must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export default function ForgotPasswordCard() {
    const [step, setStep] = useState('email'); // 'email' | 'reset'
    const [email, setEmail] = useState('');
    const router = useRouter();

    const emailForm = useForm({ resolver: zodResolver(emailSchema) });
    const resetForm = useForm({ resolver: zodResolver(resetSchema) });

    const { mutate: forgotPassword, isPending: sendingOtp } = useForgotPassword();
    const { mutate: resetPassword, isPending: resetting } = useResetPassword();

    const handleEmailSubmit = (data) => {
        forgotPassword(data, {
            onSuccess: () => {
                setEmail(data.email);
                setStep('reset');
            },
            onError: (error) => {
                const message = error.response?.data?.message || 'Something went wrong';
                emailForm.setError('root', { message });
                toast.error(message);
            },
        });
    };

    const handleResetSubmit = (data) => {
        resetPassword(
            { email, otp: data.otp, newPassword: data.newPassword },
            {
                onSuccess: () => router.push('/auth'),
                onError: (error) => {
                    const message = error.response?.data?.message || 'Invalid or expired OTP';
                    resetForm.setError('otp', { message });
                    toast.error(message);
                },
            }
        );
    };

    const handleResend = () => {
        forgotPassword({ email });
    };

    return (
        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
            <div className="hidden md:block">
                <SidePanel mode={step === 'email' ? 'forgot' : 'reset'} />
            </div>

            <div className="p-10 flex flex-col">
                <Link href="/auth" className="self-end group mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1.5 text-sm cursor-pointer text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
                >
                    <LuArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to Login
                </Link>

                <AnimatePresence mode="wait">
                    {step === 'email' ? (
                        <motion.div
                            key="email-step"
                            initial={{ opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                            <h2 className="text-2xl font-bold text-slate-900">Reset Your Password</h2>
                            <p className="mb-6 mt-1 text-sm text-slate-500">
                                Enter your email and we&apos;ll send you an OTP to reset your password.
                            </p>

                            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                                <FormField
                                    label="Email Address"
                                    icon={LuMail}
                                    placeholder="Enter your email"
                                    error={emailForm.formState.errors.email?.message}
                                    {...emailForm.register('email')}
                                />

                                {emailForm.formState.errors.root && (
                                    <p className="text-sm text-red-500">{emailForm.formState.errors.root.message}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={sendingOtp}
                                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                                >
                                    {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
                                    {!sendingOtp && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reset-step"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 24 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                            <h2 className="text-2xl font-bold text-slate-900">Enter OTP & New Password</h2>
                            <p className="mb-6 mt-1 text-sm text-slate-500">
                                We sent a 6-digit code to <span className="font-medium text-slate-700">{email}</span>
                            </p>

                            <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} className="space-y-4">
                                <FormField
                                    label="OTP Code"
                                    icon={LuKeyRound}
                                    placeholder="123456"
                                    maxLength={6}
                                    error={resetForm.formState.errors.otp?.message}
                                    {...resetForm.register('otp')}
                                />
                                <FormField
                                    label="New Password"
                                    icon={LuLock}
                                    isPassword
                                    hint="Must be at least 8 characters"
                                    placeholder="Create a new password"
                                    error={resetForm.formState.errors.newPassword?.message}
                                    {...resetForm.register('newPassword')}
                                />
                                <FormField
                                    label="Confirm Password"
                                    icon={LuLock}
                                    isPassword
                                    placeholder="Confirm your new password"
                                    error={resetForm.formState.errors.confirmPassword?.message}
                                    {...resetForm.register('confirmPassword')}
                                />


                                <button
                                    type="submit"
                                    disabled={resetting}
                                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                                >
                                    {resetting ? 'Resetting...' : 'Reset Password'}
                                    {!resetting && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="w-full cursor-pointer text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                >
                                    Didn&apos;t get the code? Resend OTP
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}