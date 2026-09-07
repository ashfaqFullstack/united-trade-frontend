import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessProfile } from "./useBusiness";
import { useCustomerProfile } from "./useCustomer";

export const useProfileCompletion = (enabled = true) => {
    const user = useAuthStore((state) => state.user);
    const isBusiness = user?.role === 'BUSINESS';
    const isCustomer = user?.role === 'CUSTOMER';
    const isAdmin = user?.role === 'ADMIN';

    const businessQuery = useBusinessProfile(enabled && !!user && isBusiness);
    const customerQuery = useCustomerProfile(enabled && !!user && isCustomer);

    if (!enabled || !user || isAdmin) {
        return { isComplete: isAdmin, isLoading: false };
    }

    if (isBusiness) {
        // A business isn't "complete" until profile details AND
        // at least one verification document are uploaded.
        const hasProfile = !!businessQuery.data;
        const hasDocuments = (businessQuery.data?.documents?.length || 0) > 0;
        return {
            isComplete: hasProfile && hasDocuments,
            isLoading: businessQuery.isLoading,
        };
    }

    return {
        isComplete: !!customerQuery.data,
        isLoading: customerQuery.isLoading,
    };
};