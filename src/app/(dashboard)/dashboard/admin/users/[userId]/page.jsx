'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiMail, FiGlobe, FiCheck, FiX, FiArrowLeft, FiFileText } from 'react-icons/fi';
import { useUserDetails, useApproveUser, useRejectUser } from '@/hooks/useAdmin';
import ApproveModal from '../../ApprovalModal';

export default function AdminUserDetailPage() {
    const { userId } = useParams();
    const router = useRouter();
    const [approveModalOpen, setApproveModalOpen] = useState(false);

    const { data: user, isLoading } = useUserDetails(userId);
    const { mutate: approve, isPending: approving } = useApproveUser();
    const { mutate: reject, isPending: rejecting } = useRejectUser();

    if (isLoading) {
        return <div className="p-8 text-center text-sm text-slate-400">Loading...</div>;
    }

    if (!user) {
        return <div className="p-8 text-center text-sm text-slate-400">User not found.</div>;
    }

    const isBusiness = user.role === 'BUSINESS';
    const profile = isBusiness ? user.businessProfile : user.customerProfile;

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

    return (
        <div className="mx-auto max-w-3xl">
            <button
                type="button"
                onClick={() => router.back()}
                className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
                <FiArrowLeft className="h-4 w-4" />
                Back to Pending Approvals
            </button>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{profile?.businessName || user.name}</h2>
                        <div className="mt-1 flex items-center gap-3 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                                <FiMail className="h-4 w-4" />
                                {user.email}
                            </span>
                            {user.country && (
                                <span className="flex items-center gap-1">
                                    <FiGlobe className="h-4 w-4" />
                                    {user.country}
                                </span>
                            )}
                        </div>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${isBusiness ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                            }`}
                    >
                        {user.role}
                    </span>
                </div>

                {profile && (
                    <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
                        {isBusiness && (
                            <>
                                <Detail label="Category" value={profile.category} />
                                <Detail label="Phone" value={profile.phone} />
                                <Detail label="City" value={profile.city} />
                                <Detail label="Address" value={profile.address} />
                            </>
                        )}
                        {!isBusiness && (
                            <>
                                <Detail label="Phone" value={profile.phone} />
                                <Detail label="City" value={profile.city} />
                                <Detail label="Address" value={profile.address} />
                            </>
                        )}
                    </div>
                )}

                {isBusiness && profile?.documents?.length > 0 && (
                    <div className="mt-6 border-t border-slate-100 pt-6">
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <FiFileText className="h-4 w-4" />
                            Verification Documents
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {profile.documents.map((doc) => (

                                <a key={doc.id}
                                    href={doc.viewUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block overflow-hidden rounded-xl border border-slate-200"
                                >
                                    <img src={doc.viewUrl} alt={doc.fileType} className="h-28 w-full object-cover" />
                                </a>
                            ))}
                        </div>
                    </div>
                )
                }

                {
                    user.status === 'PENDING' && (
                        <div className="mt-6 flex gap-3 border-t border-slate-100 pt-6">
                            <button
                                type="button"
                                onClick={() => setApproveModalOpen(true)}
                                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                <FiCheck className="h-4 w-4" />
                                Approve
                            </button>
                            <button
                                type="button"
                                disabled={rejecting}
                                onClick={handleReject}
                                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                            >
                                <FiX className="h-4 w-4" />
                                Reject
                            </button>
                        </div>
                    )
                }
            </div >

            <ApproveModal
                open={approveModalOpen}
                onClose={() => setApproveModalOpen(false)}
                onConfirm={handleApprove}
                isPending={approving}
            />
        </div >
    );
}

function Detail({ label, value }) {
    return (
        <div>
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{value || '—'}</p>
        </div>
    );
}