'use client';

import { FiCheck } from 'react-icons/fi';

const tiers = [
    { id: 'STANDARD', label: 'Standard', range: '$2,000 – $3,000' },
    { id: 'GOLD', label: 'Gold', range: '$10,000 – $15,000' },
    { id: 'PLATINUM', label: 'Platinum', range: '$25,000 – $50,000' },
];

export default function MembershipTierSelect({ value, onChange }) {
    return (
        <div className="space-y-3">
            {tiers.map((tier) => {
                const isActive = value === tier.id;
                return (
                    <button
                        key={tier.id}
                        type="button"
                        onClick={() => onChange(tier.id)}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border p-4 text-left transition ${isActive ? 'border-indigo-500 bg-indigo-50/60' : 'border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        <div>
                            <p className={`text-sm font-bold ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>
                                {tier.label} Membership
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">Trade Limit: {tier.range}</p>
                        </div>
                        <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${isActive ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                                }`}
                        >
                            {isActive && <FiCheck className="h-3 w-3" />}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}