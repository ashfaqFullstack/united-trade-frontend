'use client';

import dynamic from 'next/dynamic';

// Next.js SSR ke sath ye library kaam nahi karti (browser-only Barcode
// Detection API use karti hai), is liye dynamic import + ssr:false zaroori hai.
const Scanner = dynamic(
    () => import('@yudiel/react-qr-scanner').then((mod) => mod.Scanner),
    { ssr: false }
);

export default function QrScanner({ onScan }) {
    const handleScan = (result) => {
        const rawValue = result?.[0]?.rawValue;
        if (!rawValue) return;

        let receiverId;
        try {
            const parsed = JSON.parse(rawValue);
            receiverId = parsed?.userId;
        } catch {
            try {
                const url = new URL(rawValue, window.location.origin);
                receiverId = url.searchParams.get('receiverId');
            } catch {
                return;
            }
        }

        if (receiverId) onScan(receiverId);
    };

    return (
        <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl">
            <Scanner
                onScan={handleScan}
                formats={['qr_code']}
                constraints={{ facingMode: 'environment' }}
            />
        </div>
    );
}