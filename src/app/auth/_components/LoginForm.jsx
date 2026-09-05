'use client';

import { useState } from 'react';
import { CiMail, CiLock } from "react-icons/ci";
import FormField from './FormField';
import SocialButton from './SocialButton';
import { useLogin } from '@/hooks/useAuth';

export default function LoginForm() {
    const [form, setForm] = useState({ email: '', password: '' });
    const { mutate: login, isPending, error } = useLogin();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                label="Email Address"
                icon={CiMail}
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
            />
            <FormField
                label="Password"
                icon={CiLock}
                isPassword
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
            />

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600" />
                    Remember me
                </label>
                <a href="/forgot-password" className="font-medium text-indigo-600">
                    Forgot Password?
                </a>
            </div>

            {error && <p className="text-sm text-red-500">{error.response?.data?.message || 'Login failed'}</p>}

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
                {isPending ? 'Logging in...' : 'Login →'}
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="h-px flex-1 bg-slate-200" /> or continue with <div className="h-px flex-1 bg-slate-200" />
            </div>
        </form>
    );
}