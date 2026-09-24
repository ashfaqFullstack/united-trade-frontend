'use client';

import ProfileUpdateRequestsList from "@/components/Dashboard/Admin/users/profileUpdates/ProfileUpdateRequestsList";
import RouteGuard from "@/route/guard/RouteGuard";


export default function AdminProfileUpdatesPage() {
    return (
        <RouteGuard type="admin">
            <ProfileUpdateRequestsList />
        </RouteGuard>
    );
}