// 'use client';

// import { useState } from 'react';
// import { LuUser, LuMail, LuLock } from 'react-icons/lu';
// import FormField from './FormField';
// import SocialButton from './SocialButton';
// import RoleToggle from './RoleToggle';
// import { useRegister } from '@/hooks/useAuth';

// export default function RegisterForm() {
//     const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
//     const [role, setRole] = useState('CUSTOMER');
//     const { mutate: register, isPending, error } = useRegister();

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (form.password !== form.confirmPassword) return;
//         register({ name: form.name, email: form.email, password: form.password, role });
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <RoleToggle role={role} setRole={setRole} />

//             <FormField
//                 label="Full Name"
//                 icon={LuUser}
//                 placeholder="Enter your full name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//             />
//             <FormField
//                 label="Email Address"
//                 icon={LuMail}
//                 placeholder="Enter your email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 required
//             />
//             <FormField
//                 label="Password"
//                 icon={LuLock}
//                 isPassword
//                 hint="Must be at least 8 characters"
//                 placeholder="Create a password"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 required
//             />
//             <FormField
//                 label="Confirm Password"
//                 icon={LuLock}
//                 isPassword
//                 placeholder="Confirm your password"
//                 value={form.confirmPassword}
//                 onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
//                 required
//             />

//             {error && <p className="text-sm text-red-500">{error.response?.data?.message || 'Registration failed'}</p>}

//             <button
//                 type="submit"
//                 disabled={isPending}
//                 className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
//             >
//                 {isPending ? 'Creating account...' : 'Create Account →'}
//             </button>
//             {/* 
//             <div className="flex items-center gap-3 text-xs text-slate-400">
//                 <div className="h-px flex-1 bg-slate-200" /> or sign up with <div className="h-px flex-1 bg-slate-200" />
//             </div> */}
//         </form>
//     );
// }





'use client';

import { useState } from 'react';
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

export default function RegisterForm() {
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [role, setRole] = useState('CUSTOMER');

    const { mutate: register, isPending, error } = useRegister();

    const handleNext = () => {
        if (!role) return;

        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) return;

        register({
            name: form.name,
            email: form.email,
            password: form.password,
            role,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
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

                    <span
                        className={`text-lg font-semibold text-slate-800
                            }`}
                    >
                        {
                            step === 1 ? 'Account Type' : 'Account Details'}
                    </span>
                </div>
                {step === 2 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="group mb-1 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm cursor-pointer text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
                    >
                        <LuArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                        Back
                    </button>
                )}
            </div>

            {/* Steps */}
            <AnimatePresence mode="wait" initial={false}>
                {step === 1 ? (
                    <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: -25 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -25 }}
                        transition={{
                            duration: 0.25,
                            ease: 'easeOut',
                        }}
                        className="flex h-full min-h-[30vh] md:min-h-[360px] flex-col"
                    >
                        <RoleToggle
                            role={role}
                            setRole={setRole}
                        />

                        {/* Continue - Always at bottom */}
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
                        transition={{
                            duration: 0.25,
                            ease: 'easeOut',
                        }}
                        className="space-y-4"
                    >


                        <FormField
                            label="Full Name"
                            icon={LuUser}
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            required
                        />

                        <FormField
                            label="Email Address"
                            icon={LuMail}
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email: e.target.value,
                                })
                            }
                            required
                        />

                        <FormField
                            label="Password"
                            icon={LuLock}
                            isPassword
                            hint="Must be at least 8 characters"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password: e.target.value,
                                })
                            }
                            required
                        />

                        <FormField
                            label="Confirm Password"
                            icon={LuLock}
                            isPassword
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    confirmPassword: e.target.value,
                                })
                            }
                            required
                        />

                        {/* Password Error */}
                        {form.confirmPassword &&
                            form.password !== form.confirmPassword && (
                                <p className="text-xs font-medium text-red-500">
                                    Passwords do not match.
                                </p>
                            )}

                        {/* API Error */}
                        {error && (
                            <p className="text-sm text-red-500">
                                {error.response?.data?.message ||
                                    'Registration failed'}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={
                                isPending ||
                                form.password !== form.confirmPassword
                            }
                            className="group cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending
                                ? 'Creating account...'
                                : 'Create Account'}

                            {!isPending && (
                                <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            )}
                        </button>


                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}