'use client';

import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

// Same package + names the backend uses to pick the currency, so whatever the
// user selects here always maps to the correct currency (PKR, USD, EUR ...).
const COUNTRY_NAMES = Object.values(countries.getNames('en')).sort((a, b) => a.localeCompare(b));

export default function CountrySelect({ label = 'Country', required, error, placeholder = 'Select country', ...props }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${error
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {COUNTRY_NAMES.map((name) => (
                    <option key={name} value={name}>
                        {name}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}