import { FiArrowRight } from 'react-icons/fi';

const FIELD_LABELS = {
    businessName: 'Business Name',
    tradingName: 'Trading Name',
    businessRegistrationNumber: 'Registration Number',
    category: 'Category',
    website: 'Website',
    phone: 'Phone',
    country: 'Country',
    city: 'City',
    address: 'Address',
    secondaryContactName: 'Secondary Contact Name',
    secondaryContactPhone: 'Secondary Contact Phone',
    secondaryContactEmail: 'Secondary Contact Email',
};

export default function ProfileFieldDiff({ currentProfile, proposedData }) {
    const changedFields = Object.keys(proposedData || {}).filter(
        (key) => String(currentProfile?.[key] ?? '') !== String(proposedData[key] ?? '')
    );

    if (!changedFields.length) {
        return <p className="text-sm text-slate-400">No field changes — only documents were updated.</p>;
    }

    return (
        <div className="space-y-3">
            {changedFields.map((key) => (
                <div key={key} className="grid grid-cols-1 gap-2 rounded-xl border border-slate-100 p-3 sm:grid-cols-[140px_1fr_auto_1fr]">
                    <span className="text-xs font-semibold text-slate-500">{FIELD_LABELS[key] || key}</span>
                    <span className="truncate text-sm text-slate-400 line-through">{currentProfile?.[key] || '—'}</span>
                    <FiArrowRight className="hidden h-4 w-4 self-center text-slate-300 sm:block" />
                    <span className="truncate text-sm font-semibold text-emerald-600">{proposedData[key] || '—'}</span>
                </div>
            ))}
        </div>
    );
}