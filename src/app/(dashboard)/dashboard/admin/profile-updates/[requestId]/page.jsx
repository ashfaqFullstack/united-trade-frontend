'use client';

import ProfileUpdateRequestDetail from '@/components/Dashboard/Admin/users/profileUpdates/ProfileUpdateRequestDetail';
import RouteGuard from '@/route/guard/RouteGuard';
import { useParams } from 'next/navigation';

export default function AdminProfileUpdateDetailPage() {
    const { requestId } = useParams();
    return (
        <RouteGuard type="admin">
            <ProfileUpdateRequestDetail requestId={requestId} />
        </RouteGuard>
    );
}