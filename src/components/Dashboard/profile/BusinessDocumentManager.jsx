'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { LuCamera, LuX } from 'react-icons/lu';
import { useUploadSignature } from '@/hooks/useBusiness';
import { uploadToCloudinary } from '@/services/business.service';

const SLOTS = [
    { key: 'PHOTO_ID', label: 'Photo ID' },
    { key: 'PROOF_OF_ADDRESS', label: 'Proof of Address' },
];

export default function BusinessDocumentsManager({ existingDocuments, onChange }) {
    const [removedIds, setRemovedIds] = useState([]);
    const [newFiles, setNewFiles] = useState([]); // { previewUrl, uploading, url, publicId, fileType }
    const inputRefs = useRef({});

    const { mutateAsync: getSignature } = useUploadSignature();

    const emit = (nextRemoved, nextNewFiles) => {
        onChange({
            documentIdsToRemove: nextRemoved,
            documentsToAdd: nextNewFiles.filter((f) => f.url).map(({ url, publicId, fileType }) => ({ url, publicId, fileType })),
        });
    };

    const handleRemoveExisting = (id) => {
        const next = [...removedIds, id];
        setRemovedIds(next);
        emit(next, newFiles);
    };

    const handleFileSelect = async (slotKey, e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        const entry = { previewUrl, uploading: true, fileType: slotKey };
        const withNew = [...newFiles, entry];
        setNewFiles(withNew);

        try {
            const signatureData = await getSignature();
            const result = await uploadToCloudinary({ file, signatureData });
            if (result.error) throw new Error(result.error.message);

            const updated = withNew.map((f) =>
                f.previewUrl === previewUrl
                    ? { ...f, uploading: false, url: result.secure_url, publicId: result.public_id }
                    : f
            );
            setNewFiles(updated);
            emit(removedIds, updated);
        } catch {
            toast.error('Failed to upload document');
            const filtered = withNew.filter((f) => f.previewUrl !== previewUrl);
            setNewFiles(filtered);
        }
    };

    const removeNewFile = (previewUrl) => {
        const next = newFiles.filter((f) => f.previewUrl !== previewUrl);
        setNewFiles(next);
        emit(removedIds, next);
    };

    return (
        <div className="space-y-5">
            <p className="text-sm font-medium text-slate-700">Verification Documents</p>

            {SLOTS.map((slot) => {
                const existingForSlot = (existingDocuments || []).filter(
                    (d) => d.fileType === slot.key && !removedIds.includes(d.id)
                );
                const newForSlot = newFiles.filter((f) => f.fileType === slot.key);

                return (
                    <div key={slot.key}>
                        <p className="mb-2 text-xs font-semibold text-slate-500">{slot.label}</p>
                        <div className="grid grid-cols-4 gap-2">
                            {existingForSlot.map((doc) => (
                                <div key={doc.id} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                                    <img src={doc.viewUrl || doc.fileUrl || doc.url} alt={slot.label} className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExisting(doc.id)}
                                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                                    >
                                        <LuX className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}

                            {newForSlot.map((f) => (
                                <div key={f.previewUrl} className="relative aspect-square overflow-hidden rounded-xl border border-blue-300">
                                    <img src={f.previewUrl} alt="" className="h-full w-full object-cover" />
                                    {f.uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-[10px]">
                                            Uploading...
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeNewFile(f.previewUrl)}
                                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                                    >
                                        <LuX className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => inputRefs.current[slot.key]?.click()}
                                className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300"
                            >
                                <LuCamera className="h-4 w-4" />
                                <span className="text-[10px]">Add</span>
                            </button>
                        </div>
                        <input
                            ref={(el) => (inputRefs.current[slot.key] = el)}
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileSelect(slot.key, e)}
                            className="hidden"
                        />
                    </div>
                );
            })}
        </div>
    );
}