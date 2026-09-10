'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    FiMail,
    FiGlobe,
    FiCheck,
    FiX,
    FiArrowLeft,
    FiPhone,
    FiMapPin,
    FiGlobe as FiWebsite,
    FiHash,
    FiUser,
    FiAward,
    FiShield,
} from 'react-icons/fi';
import { useUserDetails, useApproveUser, useRejectUser } from '@/hooks/useAdmin';
import ApproveModal from '../../ApprovalModal';
import ImageModal from '@/app/components/ui/ImageModal';
import BackButton from '@/app/components/ui/BackButton';
import Loading from '@/app/components/ui/Loading';


const DOCUMENT_LABELS = {
    PHOTO_ID: 'Photo ID',
    PROOF_OF_ADDRESS: 'Proof of Address',
};

const TIER_META = {
    STANDARD: { label: 'Standard', range: '$2,000 – $3,000', accent: 'from-slate-500 to-slate-700' },
    GOLD: { label: 'Gold', range: '$10,000 – $15,000', accent: 'from-amber-500 to-orange-600' },
    PLATINUM: { label: 'Platinum', range: '$25,000 – $50,000', accent: 'from-indigo-500 to-purple-600' },
};

export default function AdminUserDetailPage() {
    const { userId } = useParams();
    const router = useRouter();
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const { data: user, isLoading } = useUserDetails(userId);
    const { mutate: approve, isPending: approving } = useApproveUser();
    const { mutate: reject, isPending: rejecting } = useRejectUser();

    if (isLoading) {
        return <Loading />
    }

    if (!user) {
        return <div className="p-8 text-center text-sm text-slate-400">User not found.</div>;
    }

    const isBusiness = user.role === 'BUSINESS';
    const profile = isBusiness ? user.businessProfile : user.customerProfile;
    const tier = profile?.membershipTier ? TIER_META[profile.membershipTier] : null;
    const documents = profile?.documents || [];
    const hasPhotoId = documents.some((d) => d.fileType === 'PHOTO_ID');
    const hasProofOfAddress = documents.some((d) => d.fileType === 'PROOF_OF_ADDRESS');

    const handleApprove = (creditLimit) => {
        approve(
            { userId: user.id, creditLimit },
            {
                onSuccess: () => {
                    setApproveModalOpen(false);
                    router.push('/dashboard');
                },
            }
        );
    };

    const handleReject = () => {
        reject(user.id, { onSuccess: () => router.push('/dashboard') });
    };

    const displayName = profile?.businessName || user.name;
    const initials = displayName?.slice(0, 2)?.toUpperCase() || '?';

    return (
        <div className="mx-auto max-w-4xl">
            <BackButton handleBack={() => router.back()} title="Back to pending approvals" />
            {/* Header / identity card */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
                            {initials}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${isBusiness ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                                        }`}
                                >
                                    {user.role}
                                </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <FiMail className="h-3.5 w-3.5" />
                                    {user.email}
                                </span>
                                {user.country && (
                                    <span className="flex items-center gap-1.5">
                                        <FiGlobe className="h-3.5 w-3.5" />
                                        {user.country}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {user.status === 'PENDING' && (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={rejecting}
                                onClick={handleReject}
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                            >
                                <FiX className="h-4 w-4" />
                                Reject
                            </button>
                            <button
                                type="button"
                                onClick={() => setApproveModalOpen(true)}
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:shadow-md"
                            >
                                <FiCheck className="h-4 w-4" />
                                Approve
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Left: business + contact info */}
                <div className="space-y-5 lg:col-span-2">
                    {profile && (
                        <div className="rounded-2xl border border-slate-100 bg-white p-6">
                            <h3 className="mb-4 text-sm font-bold text-slate-900">
                                {isBusiness ? 'Business Details' : 'Personal Details'}
                            </h3>
                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {isBusiness ? (
                                    <>
                                        <Detail icon={FiUser} label="Trading Name" value={profile.tradingName} />
                                        <Detail icon={FiHash} label="Registration Number" value={profile.businessRegistrationNumber} />
                                        <Detail icon={FiWebsite} label="Category" value={profile.category} />
                                        <Detail icon={FiWebsite} label="Website" value={profile.website} />
                                        <Detail icon={FiPhone} label="Phone" value={profile.phone} />
                                        <Detail icon={FiGlobe} label="Country" value={profile.country} />
                                        <Detail icon={FiMapPin} label="Location" value={[profile.city, profile.address].filter(Boolean).join(', ')} />
                                    </>
                                ) : (
                                    <>
                                        <Detail icon={FiPhone} label="Phone" value={profile.phone} />
                                        <Detail icon={FiGlobe} label="Country" value={profile.country} />
                                        <Detail icon={FiMapPin} label="Location" value={[profile.city, profile.address].filter(Boolean).join(', ')} />
                                    </>
                                )}
                            </dl>

                            {isBusiness && profile.secondaryContactName && (
                                <div className="mt-5 border-t border-slate-100 pt-5">
                                    <p className="mb-2 text-xs font-semibold text-slate-400">Secondary Contact</p>
                                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Detail icon={FiUser} label="Name" value={profile.secondaryContactName} />
                                        <Detail icon={FiPhone} label="Phone" value={profile.secondaryContactPhone} />
                                        <Detail icon={FiMail} label="Email" value={profile.secondaryContactEmail} />
                                    </dl>
                                </div>
                            )}
                        </div>
                    )}

                    {isBusiness && (
                        <div className="rounded-2xl border border-slate-100 bg-white p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <FiShield className="h-4 w-4 text-slate-400" />
                                    Identification & Verification
                                </h3>
                                <span className="text-xs font-medium text-slate-400">
                                    {[hasPhotoId, hasProofOfAddress].filter(Boolean).length}/2 provided
                                </span>
                            </div>

                            {documents.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                    {documents.map((doc) => (
                                        <button
                                            key={doc.id}
                                            type="button"
                                            onClick={() => setSelectedDoc(doc)}
                                            className="group overflow-hidden rounded-xl cursor-pointer border border-slate-200 text-left transition hover:border-blue-300"
                                        >
                                            <img src={doc.viewUrl} alt={doc.fileType} className="h-24 w-full object-cover" />
                                            <p className="truncate border-t border-slate-100 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-600 group-hover:text-blue-600">
                                                {DOCUMENT_LABELS[doc.fileType] || doc.fileType}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">No documents uploaded yet.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: membership tier, kept visually separate */}
                <div className="space-y-5">
                    {tier && (
                        <div className={`overflow-hidden rounded-2xl bg-gradient-to-br ${tier.accent} p-6 text-white`}>
                            <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                                <FiAward className="h-4 w-4" />
                                Requested Membership
                            </div>
                            <p className="mt-3 text-2xl font-bold">{tier.label}</p>
                            <p className="mt-1 text-sm text-white/80">Trade limit: {tier.range}</p>
                            <p className="mt-4 border-t border-white/20 pt-3 text-xs text-white/70">
                                Final credit limit is confirmed by you at approval — it can differ from this request.
                            </p>
                        </div>
                    )}

                    <div className="rounded-2xl border border-slate-100 bg-white p-6">
                        <h3 className="mb-3 text-sm font-bold text-slate-900">Application Status</h3>
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${user.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-600'
                                : user.status === 'APPROVED'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-red-50 text-red-600'
                                }`}
                        >
                            {user.status}
                        </span>
                        <p className="mt-3 text-xs text-slate-400">
                            Applied on {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <ApproveModal
                open={approveModalOpen}
                onClose={() => setApproveModalOpen(false)}
                onConfirm={handleApprove}
                isPending={approving}
            />

            <ImageModal
                open={!!selectedDoc}
                onClose={() => setSelectedDoc(null)}
                imageUrl={selectedDoc?.viewUrl}
                title={DOCUMENT_LABELS[selectedDoc?.fileType] || selectedDoc?.fileType}
            />
        </div>
    );
}

function Detail({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />}
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-slate-800">{value || '—'}</p>
            </div>
        </div>
    );
}