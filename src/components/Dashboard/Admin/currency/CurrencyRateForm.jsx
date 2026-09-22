'use client';

import { useState } from 'react';
import { LuLoaderCircle } from 'react-icons/lu';
import { useCreateCurrencyRate } from '@/hooks/useCurrency';

export default function CurrencyRateForm() {
    const [form, setForm] = useState({ countryName: '', currencyCode: '', currencySymbol: '', rate: '' });
    const { mutate: createRate, isPending } = useCreateCurrencyRate();

    const handleSubmit = (e) => {
        e.preventDefault();
        createRate(
            { ...form, rate: Number(form.rate) },
            { onSuccess: () => setForm({ countryName: '', currencyCode: '', currencySymbol: '', rate: '' }) }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6">
            <h3 className="mb-4 text-sm font-bold text-slate-900">Add New Country Rate</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Country Name</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Thailand"
                        value={form.countryName}
                        onChange={(e) => setForm({ ...form, countryName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Currency Code</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. THB"
                        value={form.currencyCode}
                        onChange={(e) => setForm({ ...form, currencyCode: e.target.value.toUpperCase() })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Currency Symbol</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. ฿"
                        value={form.currencySymbol}
                        onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Rate (1 Trade Dollar =)</label>
                    <input
                        type="number"
                        step="0.0001"
                        required
                        placeholder="e.g. 35.5"
                        value={form.rate}
                        onChange={(e) => setForm({ ...form, rate: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="mt-5 flex items-center cursor-pointer gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
                {isPending && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
                Add Rate
            </button>
        </form>
    );
}