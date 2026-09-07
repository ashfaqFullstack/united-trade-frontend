'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CiMail, CiLock } from "react-icons/ci";
import FormField from './FormField';
import SocialButton from './SocialButton';
import { useLogin } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Link from 'next/link';
import { LuArrowRight, LuLoaderCircle } from 'react-icons/lu';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({ resolver: zodResolver(loginSchema) });

    const { mutate: login, isPending } = useLogin();

    const onSubmit = (data) => {
        login(data, {
            onError: (error) => {
                const message = error.response?.data?.message || 'Login failed';
                setError('root', { message });
                toast.error(message);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                label="Email Address"
                icon={CiMail}
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email')}
            />
            <FormField
                label="Password"
                icon={CiLock}
                isPassword
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
            />

            <div className="flex  text-sm">
                {/* <label className="flex items-center gap-2 text-slate-600">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600" />
                    Remember me
                </label> */}
                <Link href="/auth/forgot-password" className="font-medium text-indigo-600">
                    Forgot Password?
                </Link>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="flex w-full group cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? (
                    <LuLoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                    'Login'
                )}
                {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </form>
    );
}