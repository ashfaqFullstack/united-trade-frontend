
'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { LuCamera, LuX, LuArrowRight, LuCheck, LuPlus, LuLoaderCircle } from 'react-icons/lu';

import { useUploadSignature, useSaveBusinessDocuments, useCompleteBusinessProfile } from '@/hooks/useBusiness';
import { uploadToCloudinary } from '@/services/business.service';

const SLOTS = [
    { key: 'PHOTO_ID', label: 'Photo ID', hint: 'Driver Licence, Passport, or Photo Card' },
    { key: 'PROOF_OF_ADDRESS', label: 'Proof of Address', hint: 'Utility Bill, Bank Statement, or Lease Agreement' },
    { key: 'BUSINESS_LICENCE', label: 'Business Licence (if applicable)', hint: 'Optional — upload your business licence if you have one', optional: true },
];

const DECLARATION_TEXT =
    'I confirm that the information provided is true and accurate. I agree to follow the trading rules and guidelines of United Trade card and understand that all trade transactions must comply with the exchange\u2019s policies.';

export default function BusinessDocumentsStep({ onNext }) {
    const [files, setFiles] = useState({ PHOTO_ID: [], PROOF_OF_ADDRESS: [], BUSINESS_LICENCE: [] });
    const [declared, setDeclared] = useState(false);
    const inputRefs = useRef({});

    const { mutateAsync: getSignature } = useUploadSignature();
    const { mutate: saveDocuments, isPending: savingDocs } = useSaveBusinessDocuments();
    const { mutate: saveDeclaration, isPending: savingDeclaration } = useCompleteBusinessProfile();
    const saving = savingDocs || savingDeclaration;

    const handleFileSelect = async (slotKey, e) => {
        const selected = Array.from(e.target.files || []);
        if (!selected.length) return;

        for (const file of selected) {
            const previewUrl = URL.createObjectURL(file);
            const entry = { previewUrl, uploading: true };

            setFiles((prev) => ({ ...prev, [slotKey]: [...prev[slotKey], entry] }));

            try {
                const signatureData = await getSignature();
                const result = await uploadToCloudinary({ file, signatureData });
                if (result.error) throw new Error(result.error.message);

                setFiles((prev) => ({
                    ...prev,
                    [slotKey]: prev[slotKey].map((f) =>
                        f.previewUrl === previewUrl
                            ? { ...f, uploading: false, url: result.secure_url, publicId: result.public_id, fileType: slotKey }
                            : f
                    ),
                }));
            } catch {
                toast.error(`Failed to upload a file for ${SLOTS.find((x) => x.key === slotKey)?.label}`);
                setFiles((prev) => ({
                    ...prev,
                    [slotKey]: prev[slotKey].filter((f) => f.previewUrl !== previewUrl),
                }));
            }
        }
    };

    const removeFile = (slotKey, previewUrl) => {
        setFiles((prev) => ({
            ...prev,
            [slotKey]: prev[slotKey].filter((f) => f.previewUrl !== previewUrl),
        }));
    };

    const allFiles = Object.values(files).flat();

    const handleContinue = () => {
        const hasBoth = files.PHOTO_ID.some((f) => f.url) && files.PROOF_OF_ADDRESS.some((f) => f.url);

        if (!hasBoth) {
            toast.error('Please upload at least one Photo ID and one Proof of Address');
            return;
        }
        if (!declared) {
            toast.error('Please accept the declaration to continue');
            return;
        }

        const uploaded = allFiles.filter((f) => f.url).map(({ url, publicId, fileType }) => ({ url, publicId, fileType }));
        const onError = (error) => toast.error(error.response?.data?.message || 'Something went wrong');

        // 1) record the declaration, 2) save the documents
        saveDeclaration(
            { declarationAccepted: true },
            {
                onSuccess: () => saveDocuments({ documents: uploaded }, { onSuccess: () => onNext(), onError }),
                onError,
            }
        );
    };

    const isUploading = allFiles.some((f) => f.uploading);

    return (
        <div className="space-y-5">
            {SLOTS.map((slot) => (
                <div key={slot.key}>
                    <p className="mb-1.5 text-sm font-medium text-slate-700">
                        {slot.label} {!slot.optional && <span className="text-red-500">*</span>}
                    </p>
                    <p className="mb-2 text-xs text-slate-400">{slot.hint}</p>

                    <div className="grid grid-cols-4 gap-2">
                        {files[slot.key].map((f) => (
                            <div key={f.previewUrl} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                                <img src={f.previewUrl} alt={slot.label} className="h-full w-full object-cover" />
                                {f.uploading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-[10px] font-medium text-slate-600">
                                        <LuLoaderCircle className="h-5 w-5 animate-spin" />
                                    </div>
                                ) : (
                                    <span className="absolute bottom-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                                        <LuCheck className="h-2.5 w-2.5" />
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeFile(slot.key, f.previewUrl)}
                                    className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white"
                                >
                                    <LuX className="h-3 w-3" />
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => inputRefs.current[slot.key]?.click()}
                            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-indigo-300 hover:bg-indigo-50/40"
                        >
                            {files[slot.key].length === 0 ? (
                                <>
                                    <LuCamera className="h-5 w-5" />
                                    <span className="text-[10px] font-medium">Upload</span>
                                </>
                            ) : (
                                <LuPlus className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <input
                        ref={(el) => (inputRefs.current[slot.key] = el)}
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileSelect(slot.key, e)}
                        className="hidden"
                    />
                </div>
            ))}

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-2 text-sm font-semibold text-slate-700">Declaration</p>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3">
                    <input
                        type="checkbox"
                        checked={declared}
                        onChange={(e) => setDeclared(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                    />
                    <span className="text-xs leading-relaxed text-slate-600">{DECLARATION_TEXT}</span>
                </label>
            </div>

            <button
                type="button"
                onClick={handleContinue}
                disabled={saving || isUploading || !declared}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
                {saving ?
                    <LuLoaderCircle className="h-5 w-5 animate-spin" />
                    : 'Continue'}
                {!saving && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </div>
    );
}