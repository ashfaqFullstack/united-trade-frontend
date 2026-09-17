'use client';

const TABS = [
    { key: 'ALL', label: 'All' },
    { key: 'ESCROW_HELD', label: 'Escrow Held' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
];

export default function OrderTabs({ orders, tab, onChange }) {
    const count = (key) => (key === 'ALL' ? orders.length : orders.filter((o) => o.status === key).length);

    return (
        <div className="flex gap-2 overflow-x-auto">
            {TABS.map((t) => (
                <button
                    key={t.key}
                    type="button"
                    onClick={() => onChange(t.key)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                >
                    {t.label} ({count(t.key)})
                </button>
            ))}
        </div>
    );
}