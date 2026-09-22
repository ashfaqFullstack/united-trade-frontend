'use client';

import { useState } from 'react';
import { LuLoaderCircle } from 'react-icons/lu';
import { FiTrash2 } from 'react-icons/fi';
import { useCurrencyRates, useUpdateCurrencyRate, useDeleteCurrencyRate } from '@/hooks/useCurrency';
import Loading from '@/components/ui/Loading';

export default function CurrencyRateTable() {
    const { data: rates, isLoading } = useCurrencyRates();
    const { mutate: updateRate, isPending: updating, variables: updatingVar } = useUpdateCurrencyRate();
    const { mutate: deleteRate, isPending: deleting, variables: deletingId } = useDeleteCurrencyRate();
    const [editValues, setEditValues] = useState({});

    if (isLoading) return <Loading />;

    const handleSave = (id) => {
        const rate = Number(editValues[id]);
        if (!rate || rate <= 0) return;
        updateRate({ rateId: id, data: { rate } });
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-bold text-slate-900">Existing Rates ({rates?.length || 0})</h3>
            </div>

            {!rates?.length ? (
                <p className="py-10 text-center text-sm text-slate-400">No currency rates added yet.</p>
            ) : (
                <div className="divide-y divide-slate-100">
                    {rates.map((r) => {
                        const isUpdatingThis = updating && updatingVar?.rateId === r.id;
                        const isDeletingThis = deleting && deletingId === r.id;

                        return (
                            <div key={r.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                                <div className="min-w-[140px] flex-1">
                                    <p className="text-sm font-semibold text-slate-900">{r.countryName}</p>
                                    <p className="text-xs text-slate-400">
                                        {r.currencyCode} ({r.currencySymbol})
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${r.source === 'LIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                        }`}
                                >
                                    {r.source}
                                </span>

                                <input
                                    type="number"
                                    step="0.0001"
                                    defaultValue={r.rate}
                                    onChange={(e) => setEditValues((prev) => ({ ...prev, [r.id]: e.target.value }))}
                                    className="w-32 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => handleSave(r.id)}
                                    disabled={isUpdatingThis}
                                    className="flex items-center gap-1.5 cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                                >
                                    {isUpdatingThis && <LuLoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                                    Save
                                </button>

                                <button
                                    type="button"
                                    onClick={() => deleteRate(r.id)}
                                    disabled={isDeletingThis}
                                    className="flex items-center gap-1 rounded-lg border cursor-pointer border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                                >
                                    {isDeletingThis ? <LuLoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <FiTrash2 className="h-3.5 w-3.5" />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}