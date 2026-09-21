'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FiCheck, FiEdit2, FiPause, FiPlay, FiTrash2, FiX, FiXCircle } from 'react-icons/fi';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    type = 'pause',
    listingTitle = '',
    isLoading = false,
}) {
    const isDelete = type === 'delete';
    const isResume = type === 'resume';
    const isEdit = type === 'edit';
    const isAccept = type === 'accept';
    const isReject = type === 'reject';
    const isCancel = type === 'cancel';
    const isComplete = type === 'complete';

    const title = isComplete
        ? 'Complete Order?'
        : isAccept
            ? 'Accept Barter Offer?'
            : isReject
                ? 'Reject Barter Offer?'
                : isCancel
                    ? 'Cancel Order?'
                    : isEdit
                        ? 'Edit Listing?'
                        : isDelete
                            ? 'Delete Listing?'
                            : isResume
                                ? 'Resume Listing?'
                                : 'Pause Listing?';

    const description = isComplete
        ? `Are you sure you want to mark "${listingTitle}" as complete? This will release the funds to the seller.`
        : isAccept
            ? `Are you sure you want to accept the offer for "${listingTitle}"?`
            : isReject
                ? `Are you sure you want to reject the offer for "${listingTitle}"?`
                : isCancel
                    ? `Are you sure you want to cancel "${listingTitle}"? This action cannot be undone.`
                    : isEdit
                        ? `Are you sure you want to edit "${listingTitle}"?`
                        : isDelete
                            ? `Are you sure you want to delete "${listingTitle}"? This action cannot be undone.`
                            : isResume
                                ? `Are you sure you want to resume "${listingTitle}"?`
                                : `Are you sure you want to pause "${listingTitle}"? It will no longer be visible to customers.`;

    const confirmText = isComplete
        ? 'Yes, Complete'
        : isAccept
            ? 'Yes, Accept'
            : isReject
                ? 'Yes, Reject'
                : isCancel
                    ? 'Yes, Cancel'
                    : isEdit
                        ? 'Yes, Edit'
                        : isDelete
                            ? 'Yes, Delete'
                            : isResume
                                ? 'Yes, Resume'
                                : 'Yes, Pause';

    const Icon = isComplete
        ? FiCheck
        : isAccept
            ? FiCheck
            : isReject
                ? FiXCircle
                : isCancel
                    ? FiXCircle
                    : isEdit
                        ? FiEdit2
                        : isDelete
                            ? FiTrash2
                            : isResume
                                ? FiPlay
                                : FiPause;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-md"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.92,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.94,
                            y: 10,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 350,
                            damping: 25,
                        }}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]"
                    >
                        {/* Close */}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="absolute right-4 cursor-pointer top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Close modal"
                        >
                            <FiX className="h-4 w-4" />
                        </button>

                        <div className="p-6 sm:p-7">
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0.7, rotate: -8 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    delay: 0.08,
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 18,
                                }}
                                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${isComplete || isAccept
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : isReject || isCancel || isDelete
                                        ? 'bg-red-50 text-red-500'
                                        : isEdit
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : isResume
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-amber-50 text-amber-500'
                                    }`}
                            >
                                <Icon className="h-7 w-7" />
                            </motion.div>

                            {/* Content */}
                            <div className="mt-5 text-center">
                                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                    {title}
                                </h2>

                                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    {description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="mt-7 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex cursor-pointer h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-70 ${isComplete || isAccept || isResume
                                        ? 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700'
                                        : isReject || isCancel || isDelete
                                            ? 'bg-red-500 shadow-red-500/20 hover:bg-red-600'
                                            : isEdit
                                                ? 'bg-indigo-600 shadow-indigo-600/20 hover:bg-indigo-700'
                                                : 'bg-amber-500 shadow-amber-500/20 hover:bg-amber-600'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Icon className="h-4 w-4" />
                                            {confirmText}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Bottom accent */}
                        <div
                            className={`h-1 w-full ${isComplete || isAccept || isResume
                                ? 'bg-emerald-500'
                                : isReject || isCancel || isDelete
                                    ? 'bg-red-500'
                                    : isEdit
                                        ? 'bg-indigo-500'
                                        : 'bg-amber-500'
                                }`}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}