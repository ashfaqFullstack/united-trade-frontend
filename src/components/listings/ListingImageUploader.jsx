'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { LuCamera, LuX, LuPlus, LuCheck, LuLoaderCircle } from 'react-icons/lu';
import { useListingUploadSignature } from '@/hooks/useListing';
import { uploadListingImage } from '@/services/listing.service';

export default function ListingImageUploader({ value = [], onChange }) {
    const [uploading, setUploading] = useState([]); // local previews while uploading
    const inputRef = useRef(null);
    const { mutateAsync: getSignature } = useListingUploadSignature();

    const handleSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (value.length + files.length > 10) {
            toast.error('You can upload up to 10 images');
            return;
        }

        for (const file of files) {
            const previewUrl = URL.createObjectURL(file);
            setUploading((prev) => [...prev, previewUrl]);

            try {
                const signatureData = await getSignature();
                const result = await uploadListingImage({ file, signatureData });
                if (result.error) throw new Error(result.error.message);

                onChange([...value, result.secure_url]);
            } catch {
                toast.error('Failed to upload an image');
            } finally {
                setUploading((prev) => prev.filter((u) => u !== previewUrl));
            }
        }
    };

    const removeImage = (url) => {
        onChange(value.filter((v) => v !== url));
    };

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Upload Images</label>
            <p className="mb-2 text-xs text-slate-400">You can upload up to 10 images (JPG, PNG, WEBP)</p>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {value.map((url) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                        <img src={url} alt="listing" className="h-full w-full object-cover" />
                        <span className="absolute bottom-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <LuCheck className="h-2.5 w-2.5" />
                        </span>
                        <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white"
                        >
                            <LuX className="h-3 w-3" />
                        </button>
                    </div>
                ))}

                {uploading.map((url) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                        <img src={url} alt="uploading" className="h-full w-full object-cover opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-[10px] font-medium text-slate-600">
                            <LuLoaderCircle className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-indigo-300 hover:bg-indigo-50/40"
                >
                    {value.length === 0 && !uploading.length ? (
                        <>
                            <LuCamera className="h-5 w-5" />
                            <span className="text-[10px] font-medium">Upload</span>
                        </>
                    ) : (
                        <LuPlus className="h-5 w-5" />
                    )}
                </button>
            </div>

            <input ref={inputRef} type="file" multiple accept="image/*" onChange={handleSelect} className="hidden" />
        </div>
    );
}