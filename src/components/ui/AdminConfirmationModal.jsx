'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { LuLoaderCircle } from 'react-icons/lu';
import { FiAlertTriangle, FiCheckCircle, FiX } from 'react-icons/fi';

export default function AdminConfirmModal({ isOpen, onClose, onConfirm, title, description, confirmText, isDanger = true, isLoading }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 10 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="absolute cursor-pointer right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                        >
                            <FiX className="h-4 w-4" />
                        </button>

                        <div
                            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${isDanger ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                                }`}
                        >
                            {isDanger ? <FiAlertTriangle className="h-6 w-6" /> : <FiCheckCircle className="h-6 w-6" />}
                        </div>

                        <h2 className="mt-4 text-center text-lg font-bold text-slate-900">{title}</h2>
                        <p className="mx-auto mt-2 max-w-xs text-center text-sm text-slate-500">{description}</p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="rounded-xl border cursor-pointer border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`flex items-center justify-center cursor-pointer gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'
                                    }`}
                            >
                                {isLoading && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}