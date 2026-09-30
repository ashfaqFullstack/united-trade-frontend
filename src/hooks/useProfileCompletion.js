
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
        const hasProfile = !!businessQuery.data;
        const docs = businessQuery.data?.documents || [];
        const hasBothDocs = docs.some((d) => d.fileType === 'PHOTO_ID') && docs.some((d) => d.fileType === 'PROOF_OF_ADDRESS');
        const hasTier = !!businessQuery.data?.membershipTier;
        const hasDeclared = !!businessQuery.data?.declarationAccepted;
        return {
            isComplete: hasProfile && hasBothDocs && hasTier && hasDeclared,
            isLoading: businessQuery.isLoading,
        };
    }

    return {
        isComplete: !!customerQuery.data,
        isLoading: customerQuery.isLoading,
    };
};