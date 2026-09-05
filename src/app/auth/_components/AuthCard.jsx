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
            <SidePanel mode={mode} />
            {/* <div className="hidden md:block">
            </div> */}

            <div className="p-10">
                <div className="mb-8 flex justify-center">
                    <div className="relative inline-flex rounded-full bg-slate-100 p-1">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`relative z-10 cursor-pointer rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200 ${isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            className={`relative z-10 cursor-pointer rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200 ${!isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Sign Up
                        </button>

                        <motion.div
                            layout
                            layoutDependency={mode}
                            className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                            initial={false}
                            animate={{ x: isLogin ? 4 : '100%' }}
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
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
                        <h2 className="text-center md:text-start text-2xl font-bold text-slate-900">
                            {isLogin && 'Welcome Back'}
                        </h2>
                        <p className="text-center md:text-start mb-6 mt-1 text-sm text-slate-500">
                            {isLogin && 'Login to continue your journey.'}
                        </p>

                        {isLogin ? <LoginForm /> : <RegisterForm />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}