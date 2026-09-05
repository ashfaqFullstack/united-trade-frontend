'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidePanel from './SidePanel';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthCard() {
    const [mode, setMode] = useState('login');
    const isLogin = mode === 'login';

    return (
        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
            <div className="hidden md:block" >
                <SidePanel mode={mode} />
            </div>

            <div className="p-10">

                <div className="mb-8 border-b border-slate-200">
                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`relative cursor-pointer rounded-t-lg flex-1 py-3 text-sm font-semibold transition-all duration-300 ${isLogin
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Login

                            {isLogin && (
                                <motion.div
                                    layoutId="auth-tab-indicator"
                                    className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-indigo-600"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 35,
                                    }}
                                />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            className={`relative cursor-pointer rounded-t-lg flex-1 py-3 text-sm font-semibold transition-all duration-300 ${!isLogin
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400  hover:text-slate-600'
                                }`}
                        >
                            Sign Up

                            {!isLogin && (
                                <motion.div
                                    layoutId="auth-tab-indicator"
                                    className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-indigo-600"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 35,
                                    }}
                                />
                            )}
                        </button>
                    </div>
                </div>


                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, x: isLogin ? -24 : 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isLogin ? 24 : -24 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isLogin && 'Welcome Back 👋'}
                        </h2>
                        <p className="mb-6 mt-1 text-sm text-slate-500">
                            {isLogin && 'Login to continue your journey.'}
                        </p>

                        {isLogin ? <LoginForm /> : <RegisterForm />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}