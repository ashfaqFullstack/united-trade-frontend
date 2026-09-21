'use client';

import { useCurrencyRates } from '@/hooks/useCurrency';
import { useAuthStore } from '@/store/useAuthStore';

// Drop this anywhere (e.g. inside WalletOverview) to show a converted
// value. Not used anywhere by default.
export default function CurrencyConversion({ tradeDollarAmount }) {
    const user = useAuthStore((state) => state.user);
    const { data: rates } = useCurrencyRates(!!user?.country);

    const match = rates?.find((r) => r.countryName === user?.country);
    if (!match) return null;

    const converted = Number(tradeDollarAmount) * Number(match.rate);

    return (
        <p className="text-xs text-white/70">
            ≈ {match.currencySymbol}
            {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
    );
}