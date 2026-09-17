'use client';

import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
    FiEdit2,
    FiPause,
    FiPlay,
    FiTrash2,
    FiMapPin,
    FiArrowUpRight,
    FiMoreVertical,
} from 'react-icons/fi';

export default function ListingCard({
    listing,
    mode = 'public',
    onPauseToggle,
    onDelete,
}) {
    const image = listing.imageUrls?.[0];

    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        type: null,
    });

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef(null);
    const router = useRouter();

    const sellerName =
        listing.business?.businessProfile?.businessName ||
        listing.business?.name;

    const location = [
        listing.business?.businessProfile?.city,
        listing.business?.businessProfile?.country,
    ]
        .filter(Boolean)
        .join(', ');

    const isActive = listing.status === 'ACTIVE';

    const detailsHref = mode === 'public'
        ? `/marketplace/${listing.id}`
        : null;
    const editHref = `/dashboard/listings/${listing.id}/edit`;
    const CardWrapper = detailsHref ? Link : 'div';
    const cardLinkProps = detailsHref ? { href: detailsHref } : {};

    // Close mobile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    const openConfirmation = (type) => {
        setIsMenuOpen(false);

        setConfirmation({
            isOpen: true,
            type,
        });
    };

    const closeConfirmation = () => {
        setConfirmation({
            isOpen: false,
            type: null,
        });
    };

    const handleConfirm = () => {
        if (confirmation.type === 'edit') {
            router.push(editHref);
        } else if (confirmation.type === 'delete') {
            onDelete?.(listing);
        } else {
            onPauseToggle?.(listing);
        }

        closeConfirmation();
    };

    return (
        // <article className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_18px_45px_rgba(15,23,42,0.11)]">
        <article className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-indigo-100 hover:shadow-[0_18px_45px_rgba(15,23,42,0.11)]">
            {/* Image */}
            <CardWrapper {...cardLinkProps} className="block">
                <div className="relative aspect-[4/3] bg-slate-100">

                    {image ? (
                        <img
                            src={image}
                            alt={listing.title}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                            <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-400 shadow-sm">
                                No image available
                            </span>
                        </div>
                    )}

                    {/* Image gradient */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Status */}
                    <div className="absolute flex w-full justify-between ml-3 top-3">
                        {(mode === 'owner' && !listing.isPublic) ?
                            <span className="absolute left-2 top-2 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-white">
                                Private
                            </span> :
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-md ${isActive
                                    ? 'border-emerald-200/80 bg-white/90 text-emerald-700'
                                    : 'border-slate-200/80 bg-white/90 text-slate-500'
                                    }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${isActive
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-400'
                                        }`}
                                />

                                {isActive ? 'Active' : 'Paused'}
                            </span>
                        }
                    </div>

                    {/* Public view icon */}
                    {mode === 'public' && (
                        <div className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <FiArrowUpRight className="h-4 w-4" />
                        </div>
                    )}

                    {/* Mobile Owner Menu */}
                    {mode === 'owner' && (
                        <div
                            ref={menuRef}
                            className="absolute right-3 top-3 sm:hidden"
                        >
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setIsMenuOpen((prev) => !prev);
                                }}
                                className="flex h-10 cursor-pointer w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-white active:scale-95"
                                aria-label="Listing actions"
                                aria-expanded={isMenuOpen}
                            >
                                <FiMoreVertical className="h-5 w-5" />
                            </button>

                            {/* Dropdown */}
                            {isMenuOpen && (
                                <div
                                    className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
                                    onClick={(event) =>
                                        event.stopPropagation()
                                    }
                                >
                                    {/* Edit */}
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            openConfirmation('edit');
                                        }}
                                        className="flex cursor-pointer w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                            <FiEdit2 className="h-4 w-4" />
                                        </span>

                                        <span>Edit</span>
                                    </button>

                                    {/* Status */}

                                    {mode === 'owner' && listing.isPublic && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openConfirmation(
                                                    isActive
                                                        ? 'pause'
                                                        : 'resume'
                                                )
                                            }
                                            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                                {isActive ? (
                                                    <FiPause className="h-4 w-4" />
                                                ) : (
                                                    <FiPlay className="h-4 w-4" />
                                                )}
                                            </span>

                                            <span>
                                                {isActive
                                                    ? 'Pause'
                                                    : 'Resume'}
                                            </span>
                                        </button>
                                    )}

                                    {/* Divider */}
                                    <div className="my-1.5 h-px bg-slate-100" />

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openConfirmation('delete')
                                        }
                                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                                            <FiTrash2 className="h-4 w-4" />
                                        </span>

                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardWrapper>

            {/* Content */}
            <div className="p-4 sm:p-5">

                {/* Category */}
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-500">
                    {listing.category}
                </p>

                {/* Title */}
                <CardWrapper {...cardLinkProps} className="block">
                    <h3 className="line-clamp-2 min-h-[40px] text-[15px] font-bold leading-5 text-slate-900 transition-colors duration-200 group-hover:text-indigo-600 sm:text-base">
                        {listing.title}
                    </h3>
                </CardWrapper>

                {/* Price */}
                <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Trading Value
                        </p>

                        <p className="mt-0.5 text-lg font-extrabold tracking-tight text-indigo-600 sm:text-xl">
                            ${Number(listing.price).toLocaleString()}
                        </p>
                    </div>

                    {mode === 'public' && (
                        <Link
                            href={detailsHref}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            aria-label={`View ${listing.title}`}
                        >
                            <FiArrowUpRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>

                {/* Seller */}
                {mode === 'public' && sellerName && (
                    <div className="mt-3 flex items-start gap-2.5 border-t border-slate-100 pt-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <FiMapPin className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-700">
                                {sellerName}
                            </p>

                            {location && (
                                <p className="mt-0.5 truncate text-[9px] text-slate-400">
                                    {location}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Desktop Owner Actions */}
                {mode === 'owner' && (
                    <div className=" mt-4 hidden items-center gap-2 border-t border-slate-100 pt-3 sm:flex">

                        {/* Edit */}
                        <button
                            type="button"
                            onClick={() => openConfirmation('edit')}
                            className="group/action cursor-pointer flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-[11px] font-semibold text-slate-600 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:text-xs"
                        >
                            <FiEdit2 className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/action:scale-110" />
                            <span className="truncate">Edit</span>
                        </button>

                        {
                            mode === 'owner' && listing.isPublic && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        openConfirmation(
                                            isActive ? 'pause' : 'resume'
                                        )
                                    }
                                    className="group/action flex min-w-0 cursor-pointer flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-[11px] font-semibold text-slate-600 transition-all duration-200 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 sm:text-xs"
                                >
                                    {isActive ? (
                                        <FiPause className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/action:scale-110" />
                                    ) : (
                                        <FiPlay className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/action:scale-110" />
                                    )}

                                    <span className="truncate">
                                        {isActive ? 'Pause' : 'Resume'}
                                    </span>
                                </button>
                            )}

                        {/* Delete */}
                        <button
                            type="button"
                            onClick={() =>
                                openConfirmation('delete')
                            }
                            className="group/action flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50/60 px-2 py-2.5 text-[11px] font-semibold text-red-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:text-xs"
                        >
                            <FiTrash2 className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/action:scale-110" />
                            <span className="truncate">Delete</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmation.isOpen}
                type={confirmation.type}
                listingTitle={listing.title}
                onClose={closeConfirmation}
                onConfirm={handleConfirm}
            />
        </article >
    );
}