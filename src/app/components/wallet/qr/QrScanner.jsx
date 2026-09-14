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
        if (!result?.length) return;

        try {
            const parsed = JSON.parse(result[0].rawValue);
            if (parsed?.userId) onScan(parsed.userId);
        } catch {
            // ignore invalid QR content
        }
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