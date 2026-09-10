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
        return {
            isComplete: hasProfile && hasBothDocs,
            isLoading: businessQuery.isLoading,
        };
    }

    return {
        isComplete: !!customerQuery.data && !!customerQuery.data.membershipTier,
        isLoading: customerQuery.isLoading,
    };
};