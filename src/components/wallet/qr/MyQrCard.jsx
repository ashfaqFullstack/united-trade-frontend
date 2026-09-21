'use client';

import { FiDownload, FiShare2, FiInfo } from 'react-icons/fi';
import { useMyQrCode } from '@/hooks/useTransaction';
import { useAuthStore } from '@/store/useAuthStore';

const STEPS = [
    'Share your QR code with the sender',
    'They scan it using the Send Money screen',
    'They enter the amount and their wallet PIN',
    'Complete the transfer',
];

export default function MyQrCard() {
    const { data, isLoading } = useMyQrCode();
    const user = useAuthStore((state) => state.user);

    const handleDownload = () => {
        if (!data?.qrCodeImage) return;
        const link = document.createElement('a');
        link.href = data.qrCodeImage;
        link.download = 'my-qr-code.png';
        link.click();
    };

    const handleShare = async () => {
        if (navigator.share && data?.qrCodeImage) {
            try {
                await navigator.share({ title: 'My Trade Barter QR Code' });
            } catch { }
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-sm text-slate-400">Generating QR code...</div>;
    }

    return (
        <div className="mx-auto max-w-md space-y-5">
            <h2 className="text-center text-lg font-bold text-slate-900">Your QR Code</h2>
            <p className="text-center text-sm text-slate-500">Let others scan the QR code to send you money.</p>

            <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-8">
                {data?.qrCodeImage && (
                    <img src={data.qrCodeImage} alt="My QR Code" className="h-56 w-56 rounded-xl" />
                )}
                <p className="mt-4 text-base font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-400">United Trade</p>

                <button
                    type="button"
                    onClick={handleDownload}
                    className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <FiDownload className="h-4 w-4" />
                    Download QR
                </button>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <FiInfo className="h-4 w-4 text-blue-500" />
                    How it works
                </p>
                <ol className="space-y-2 text-sm text-slate-500">
                    {STEPS.map((step, i) => (
                        <li key={i} className="flex gap-2">
                            <span className="font-semibold text-blue-600">{i + 1}.</span>
                            {step}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}