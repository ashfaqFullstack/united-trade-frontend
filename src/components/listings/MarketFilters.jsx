'use client';

import { BUSINESS_CATEGORIES } from '@/const/const';
import { useState } from 'react';

export default function MarketplaceFilters({ onApply }) {
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [country, setCountry] = useState('');

    const apply = () => {
        onApply({
            category: category || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            country: country || undefined,
        });
    };

    const clear = () => {
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        setCountry('');
        onApply({});
    };

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900">Filters</h3>

            <div className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border cursor-pointer border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="">All</option>
                        {BUSINESS_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Price Range</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <span className="text-slate-300">–</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Country</label>
                    <input
                        type="text"
                        placeholder="All Countries"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={apply}
                className="mt-5 w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                Apply Filters
            </button>
            <button
                type="button"
                onClick={clear}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
            >
                Clear All
            </button>
        </div>
    );
}