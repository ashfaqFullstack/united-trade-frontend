'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useBusinessProfile } from '@/hooks/useBusiness';
import { useCustomerProfile } from '@/hooks/useCustomer';

export default function ProfileSummaryCard() {
    const user = useAuthStore((state) => state.user);
    const isBusiness = user?.role === 'BUSINESS';

    const { data: business } = useBusinessProfile(isBusiness);
    const { data: customer } = useCustomerProfile(!isBusiness);

    const profile = isBusiness ? business : customer;
    if (!profile) return null;

    const fields = isBusiness
        ? [
            ['Business Name', profile.businessName],
            ['Category', profile.category],
            ['City', profile.city],
            ['Phone', profile.phone],
        ]
        : [
            ['Phone', profile.phone],
            ['City', profile.city],
            ['Address', profile.address],
        ];

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900">Your Profile</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map(([label, value]) => (
                    <div key={label}>
                        <p className="text-xs font-medium text-slate-400">{label}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{value || '—'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}