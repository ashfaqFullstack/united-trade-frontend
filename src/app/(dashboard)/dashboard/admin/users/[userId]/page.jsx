'use client';

import UserDetailView from '@/app/components/Dashboard/Admin/UserDetailsView';
import { useParams } from 'next/navigation';

export default function AdminUserDetailPage() {
    const { userId } = useParams();
    return <UserDetailView userId={userId} />;
}