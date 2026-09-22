'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useBusinessProfile } from '@/hooks/useBusiness';
import { useCustomerProfile } from '@/hooks/useCustomer';
import Loading from '@/components/ui/Loading';
import BusinessProfileEditForm from './BusinessProfileEditForm';
import CustomerProfileEditForm from './CustomerProfileEditForm';
import ProfileOverview from './ProfileOverview';
import BackButton from '@/components/ui/BackButton';
import { useRouter } from 'next/navigation';

export default function MyProfilePage() {
    const user = useAuthStore((state) => state.user);
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false);
    const isBusiness = user?.role === 'BUSINESS';
    const { data: businessProfile, isLoading: isBusinessLoading } = useBusinessProfile(!!user && isBusiness);
    const { data: customerProfile, isLoading: isCustomerLoading } = useCustomerProfile(!!user && !isBusiness);

    if (!user) return null;

    const profile = isBusiness ? businessProfile : customerProfile;
    const isLoading = isBusiness ? isBusinessLoading : isCustomerLoading;

    if (isLoading) return <Loading />;

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            {isEditing ? (
                <>
                    <div className='flex items-center justify-between' >
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Edit profile</h2>
                            <p className="text-sm text-slate-500">Keep your profile details up to date.</p>
                        </div>
                        <BackButton handleBack={() => router.back()} title="Back" />
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white p-6">
                        {isBusiness ? (
                            <BusinessProfileEditForm onCancel={() => setIsEditing(false)} onSaved={() => setIsEditing(false)} />
                        ) : (
                            <CustomerProfileEditForm onCancel={() => setIsEditing(false)} onSaved={() => setIsEditing(false)} />
                        )}
                    </div>
                </>
            ) : (
                <ProfileOverview user={user} profile={profile} onEdit={() => setIsEditing(true)} />
            )}
        </div>
    );
}