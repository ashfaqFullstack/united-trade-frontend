'use client';

import { useAuthStore } from "@/store/useAuthStore";
import RouteGuard from "@/route/guard/RouteGuard";
import BusinessOnboarding from "../../components/onboarding/BusinessOnboarding";
import CustomerOnboarding from "../../components/onboarding/CustomerOnbaording";


export default function OnboardingPage() {
    const user = useAuthStore((state) => state.user);

    return (
        <RouteGuard type="onboarding">
            {user ? (
                user.role === 'BUSINESS' ? <BusinessOnboarding /> : <CustomerOnboarding />
            ) : null}
        </RouteGuard>
    );
}