'use client';

import { useState } from 'react';
import {
    FiBriefcase,
    FiEdit2,
    FiGlobe,
    FiHash,
    FiMail,
    FiMapPin,
    FiPhone,
    FiShield,
    FiUser,
} from 'react-icons/fi';
import { DOCUMENT_LABELS, TIER_META } from '@/const/const';
import ImageModal from '@/components/ui/ImageModal';
import Image from 'next/image';

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">{label}</p>
                <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-800">{value || 'Not provided'}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const isApproved = status === 'APPROVED';

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {status || 'ACTIVE'}
        </span>
    );
}

export default function ProfileOverview({ user, profile, onEdit }) {
    const [selectedDocument, setSelectedDocument] = useState(null);
    const isBusiness = user.role === 'BUSINESS';
    const documents = profile?.documents || [];
    const tier = profile?.membershipTier ? TIER_META[profile.membershipTier] : null;
    const displayName = isBusiness ? profile?.businessName : user.name;
    const initials = (displayName || user.email || '?').slice(0, 2).toUpperCase();

    return (
        <div className="space-y-5">
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-7 text-white sm:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold ring-1 ring-white/25">
                                {initials}
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">{isBusiness ? 'Business profile' : 'Member profile'}</p>
                                <h2 className="mt-1 text-2xl font-bold">{displayName || 'Your profile'}</h2>
                                <p className="mt-1 flex items-center gap-1.5 text-sm text-blue-100">
                                    <FiMail className="h-3.5 w-3.5" />
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onEdit}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
                        >
                            <FiEdit2 className="h-4 w-4" />
                            Edit profile
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-6 py-4 sm:px-8">
                    <StatusBadge status={user.status} />
                    {isBusiness && profile?.category && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{profile.category}</span>
                    )}
                    {tier && <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">{tier.label} membership</span>}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        {isBusiness ? <FiBriefcase className="h-4 w-4" /> : <FiUser className="h-4 w-4" />}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">{isBusiness ? 'Business details' : 'Personal details'}</h3>
                        <p className="text-xs text-slate-400">Information visible on your member profile</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                    {isBusiness && <InfoItem icon={FiBriefcase} label="Trading name" value={profile?.tradingName} />}
                    {isBusiness && <InfoItem icon={FiHash} label="Registration number" value={profile?.businessRegistrationNumber} />}
                    {isBusiness && <InfoItem icon={FiGlobe} label="Website" value={profile?.website} />}
                    <InfoItem icon={FiPhone} label="Phone" value={profile?.phone} />
                    <InfoItem icon={FiGlobe} label="Country" value={profile?.country} />
                    <InfoItem icon={FiMapPin} label="Location" value={[profile?.city, profile?.address].filter(Boolean).join(', ')} />
                </div>

                {isBusiness && profile?.secondaryContactName && (
                    <div className="mt-7 border-t border-slate-100 pt-6">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Secondary contact</p>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-3">
                            <InfoItem icon={FiUser} label="Name" value={profile.secondaryContactName} />
                            <InfoItem icon={FiPhone} label="Phone" value={profile.secondaryContactPhone} />
                            <InfoItem icon={FiMail} label="Email" value={profile.secondaryContactEmail} />
                        </div>
                    </div>
                )}
            </section>

            {isBusiness && (
                <section className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <FiShield className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Verification documents</h3>
                                <p className="text-xs text-slate-400">Your uploaded identification and address documents</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">{documents.length} uploaded</span>
                    </div>

                    {documents.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {documents.map((document, index) => {
                                const imageUrl = document.fileUrl || document.url;
                                return (
                                    <button
                                        key={document.id || document.publicId || `${document.fileType}-${index}`}
                                        type="button"
                                        onClick={() => setSelectedDocument({ ...document, imageUrl })}
                                        className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 text-left transition hover:border-blue-400 hover:shadow-sm"
                                    >
                                        <Image src={imageUrl} height={200} width={200} alt={DOCUMENT_LABELS[document.fileType] || 'Uploaded document'} className="h-28 w-full object-cover transition group-hover:scale-105" />
                                        <p className="truncate border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 group-hover:text-blue-600">
                                            {DOCUMENT_LABELS[document.fileType] || document.fileType || 'Document'}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-400">No documents uploaded yet.</p>
                    )}
                </section>
            )}

            <ImageModal
                open={!!selectedDocument}
                onClose={() => setSelectedDocument(null)}
                imageUrl={selectedDocument?.imageUrl}
                title={DOCUMENT_LABELS[selectedDocument?.fileType] || 'Document'}
            />
        </div>
    );
}
