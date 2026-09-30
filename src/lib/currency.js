
export function formatMoney(amount, currency = 'USD') {
    try {
        // Intl picks the right decimals + symbol per currency (USD 2, JPY 0, KWD 3 ...).
        return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount || 0));
    } catch {
        return `${Number(amount || 0).toLocaleString()} ${currency}`;
    }
}

// formatDisplay(listing, 'price')  ->  "PKR 1,000.00" in the viewer's currency
export function formatDisplay(record, field) {
    if (!record) return formatMoney(0, 'USD');
    const display = record.display;
    if (display && display[field] !== undefined) {
        return formatMoney(display[field], display.currency);
    }
    return formatMoney(record[field], 'USD'); // fallback: raw USD (e.g. logged-out visitor)
}

export function getCurrencySymbol(currency = 'USD') {
    try {
        return (
            new Intl.NumberFormat(undefined, { style: 'currency', currency })
                .formatToParts(0)
                .find((part) => part.type === 'currency')?.value || currency
        );
    } catch {
        return currency;
    }
}