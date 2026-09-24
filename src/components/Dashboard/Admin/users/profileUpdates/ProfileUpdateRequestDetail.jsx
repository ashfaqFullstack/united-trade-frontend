'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiFileText } from 'react-icons/fi';
import Loading from '@/components/ui/Loading';
import BackButton from '@/components/ui/BackButton';
import DetailItem from '@/components/ui/DetailItem';
import ImageModal from '@/components/ui/ImageModal';
import AdminConfirmModal from '@/components/ui/AdminConfirmationModal';
import RejectModal from '@/components/Dashboard/Admin/Modals/RejectModal';
import ProfileFieldDiff from './ProfileFieldDiff';
import {
    useProfileUpdateRequestDetail,
    useApproveProfileUpdateRequest,
    useRejectProfileUpdateRequest,
} from '@/hooks/useAdmin';

export default function ProfileUpdateRequestDetail({ requestId }) {
    const router = useRouter();
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const { data: request, isLoading } = useProfileUpdateRequestDetail(requestId);
    const { mutate: approve, isPending: approving } = useApproveProfileUpdateRequest();
    const { mutate: reject, isPending: rejecting } = useRejectProfileUpdateRequest();

    if (isLoading) return <Loading />;
    if (!request) return <div className="p-8 text-center text-sm text-slate-400">Request not found.</div>;

    const isBusiness = request.user?.role === 'BUSINESS';
    const currentProfile = isBusiness ? request.user?.businessProfile : request.user?.customerProfile;
    const existingDocuments = currentProfile?.documents || [];
    const documentsToRemove = existingDocuments.filter((d) => request.documentIdsToRemove?.includes(d.id));
    const documentsToAdd = request.documentsToAdd || [];

    const handleApprove = () => {
        approve(request.id, {
            onSuccess: () => {
                setApproveModalOpen(false);
                router.push('/dashboard/admin/profile-updates');
            },
        });
    };

    const handleReject = (reason) => {
        reject(
            { requestId: request.id, reason },
            {
                onSuccess: () => {
                    setRejectModalOpen(false);
                    router.push('/dashboard/admin/profile-updates');
                },
            }
        );
    };

    const isPending = request.status === 'PENDING';

    return (
        <div className="mx-auto max-w-3xl space-y-5">
            <BackButton handleBack={() => router.back()} title="Back" />

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{request.user?.name}</h2>
                        <p className="flex items-center gap-1.5 text-sm text-slate-400">
                            <FiMail className="h-3.5 w-3.5" />
                            {request.user?.email}
                        </p>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${request.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-600'
                            : request.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-red-50 text-red-500'
                            }`}
                    >
                        {request.status}
                    </span>
                </div>

                {isPending && (
                    <div className="mt-5 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setRejectModalOpen(true)}
                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                        >
                            Reject
                        </button>
                        <button
                            type="button"
                            onClick={() => setApproveModalOpen(true)}
                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:shadow-md"
                        >
                            Approve
                        </button>
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Requested Changes</h3>
                <ProfileFieldDiff currentProfile={currentProfile} proposedData={request.proposedData} />
            </div>

            {isBusiness && (documentsToAdd.length > 0 || documentsToRemove.length > 0) && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <FiFileText className="h-4 w-4 text-slate-400" />
                        Document Changes
                    </h3>

                    {documentsToAdd.length > 0 && (
                        <div className="mb-4">
                            <p className="mb-2 text-xs font-semibold text-emerald-600">To be added</p>
                            <div className="grid grid-cols-4 gap-2">
                                {documentsToAdd.map((doc, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedDoc(doc)}
                                        className="aspect-square overflow-hidden rounded-xl border border-emerald-200"
                                    >
                                        <img src={doc.url} alt={doc.fileType} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {documentsToRemove.length > 0 && (
                        <div>
                            <p className="mb-2 text-xs font-semibold text-red-500">To be removed</p>
                            <div className="grid grid-cols-4 gap-2">
                                {documentsToRemove.map((doc) => (
                                    <button
                                        key={doc.id}
                                        type="button"
                                        onClick={() => setSelectedDoc(doc)}
                                        className="aspect-square overflow-hidden rounded-xl border border-red-200 opacity-70"
                                    >
                                        <img src={doc.viewUrl || doc.fileUrl} alt={doc.fileType} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {request.status === 'REJECTED' && request.rejectionReason && (
                <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6">
                    <p className="text-xs font-semibold text-red-500">Rejection Reason</p>
                    <p className="mt-1 text-sm text-slate-700">{request.rejectionReason}</p>
                </div>
            )}

            <AdminConfirmModal
                isOpen={approveModalOpen}
                onClose={() => setApproveModalOpen(false)}
                onConfirm={handleApprove}
                title="Approve these changes?"
                description="The user's profile will be updated immediately with these changes."
                confirmText="Yes, Approve"
                isDanger={false}
                isLoading={approving}
            />

            <RejectModal
                open={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                onConfirm={handleReject}
                isPending={rejecting}
            />

            <ImageModal
                open={!!selectedDoc}
                onClose={() => setSelectedDoc(null)}
                imageUrl={selectedDoc?.url || selectedDoc?.viewUrl || selectedDoc?.fileUrl}
                title={selectedDoc?.fileType}
            />
        </div>
    );
}