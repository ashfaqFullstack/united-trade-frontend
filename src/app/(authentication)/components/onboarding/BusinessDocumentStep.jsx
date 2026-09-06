'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { LuCamera, LuX, LuArrowRight } from 'react-icons/lu';

import { useUploadSignature, useSaveBusinessDocuments } from '@/hooks/useBusiness';
import { uploadToCloudinary } from '@/services/business.service';

export default function BusinessDocumentsStep({ onNext }) {
    const [files, setFiles] = useState([]); // { previewUrl, uploading, url, publicId, fileType }
    const inputRef = useRef(null);

    const { mutateAsync: getSignature } = useUploadSignature();
    const { mutate: saveDocuments, isPending: saving } = useSaveBusinessDocuments();

    const handleFileSelect = async (e) => {
        const selected = Array.from(e.target.files || []);
        if (!selected.length) return;

        for (const file of selected) {
            const previewUrl = URL.createObjectURL(file);
            const entry = { previewUrl, uploading: true };
            setFiles((prev) => [...prev, entry]);

            try {
                const signatureData = await getSignature();
                const result = await uploadToCloudinary({ file, signatureData });

                if (result.error) throw new Error(result.error.message);

                setFiles((prev) =>
                    prev.map((f) =>
                        f.previewUrl === previewUrl
                            ? { ...f, uploading: false, url: result.secure_url, publicId: result.public_id, fileType: file.name }
                            : f
                    )
                );
            } catch (err) {
                toast.error('Failed to upload a document');
                setFiles((prev) => prev.filter((f) => f.previewUrl !== previewUrl));
            }
        }
    };

    const removeFile = (previewUrl) => {
        setFiles((prev) => prev.filter((f) => f.previewUrl !== previewUrl));
    };

    const handleContinue = () => {
        const uploaded = files.filter((f) => f.url).map(({ url, publicId, fileType }) => ({ url, publicId, fileType }));

        if (!uploaded.length) {
            toast.error('Please upload at least one document');
            return;
        }

        saveDocuments(
            { documents: uploaded },
            {
                onSuccess: () => onNext(),
                onError: (error) => toast.error(error.response?.data?.message || 'Something went wrong'),
            }
        );
    };

    const isUploading = files.some((f) => f.uploading);

    return (
        <div className="space-y-4">
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-10 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50/40"
            >
                <LuCamera className="h-6 w-6" />
                <span className="text-sm font-medium">Click to upload documents</span>
                <span className="text-xs text-slate-400">JPG, PNG, PDF</span>
            </button>
            <input ref={inputRef} type="file" multiple accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />

            {files.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {files.map((f) => (
                        <div key={f.previewUrl} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                            <img src={f.previewUrl} alt="document" className="h-full w-full object-cover" />
                            {f.uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs font-medium text-slate-600">
                                    Uploading...
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => removeFile(f.previewUrl)}
                                className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white"
                            >
                                <LuX className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={handleContinue}
                disabled={saving || isUploading}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
                {saving ? 'Saving...' : 'Continue'}
                {!saving && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </div>
    );
}