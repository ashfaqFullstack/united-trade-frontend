'use client';

import { useEffect, useState } from 'react';
import { useConversionPreview } from '@/hooks/useCurrency';
import { formatMoney } from '@/lib/currency';

// Shows, live under the amount input: "Receiver will get ≈ $1.00 USD"
export default function ReceiverPreview({ receiverId, amount }) {
    // small debounce so we don't hit the API on every keystroke
    const [debounced, setDebounced] = useState(amount);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(amount), 300);
        return () => clearTimeout(id);
    }, [amount]);

    const { data, isFetching } = useConversionPreview({ receiverId, amount: debounced }, Number(amount) > 0);

    if (!data || !(Number(amount) > 0)) return null;

    return (
        <p className={`mt-3 text-center text-sm text-slate-500 transition ${isFetching ? 'opacity-60' : ''}`}>
            Receiver will get ≈{' '}
            <span className="font-semibold text-slate-800">
                {formatMoney(data.receiverAmount, data.receiverCurrency)} {data.receiverCurrency}
            </span>
        </p>
    );
}