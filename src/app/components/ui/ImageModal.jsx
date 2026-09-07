'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function ImageModal({ open, onClose, imageUrl, title }) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute -top-10 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        >
                            <FiX className="h-5 w-5" />
                        </button>

                        <img
                            src={imageUrl}
                            alt={title || 'document'}
                            className="max-h-[85vh] w-full rounded-xl object-contain shadow-2xl"
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}