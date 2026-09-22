'use client';

import UserDetailView from '@/components/Dashboard/Admin/users/UserDetailsView';
import RouteGuard from '@/route/guard/RouteGuard';
import { useParams } from 'next/navigation';

export default function AdminUserDetailPage() {
    const { userId } = useParams();
    return (
        <RouteGuard type="admin" >
            <UserDetailView userId={userId} />
        </RouteGuard>
    )
}