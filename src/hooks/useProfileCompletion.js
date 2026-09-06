import { useAuthStore } from '@/store/useAuthStore';
import { useBusinessProfile } from './useBusiness';
import { useCustomerProfile } from './useCustomer';

export const useProfileCompletion = (enabled = true) => {
    const user = useAuthStore((state) => state.user);
    const isBusiness = user?.role === 'BUSINESS';
    const isCustomer = user?.role === 'CUSTOMER';
    const isAdmin = user?.role === 'ADMIN';

    const businessQuery = useBusinessProfile(enabled && !!user && isBusiness);
    const customerQuery = useCustomerProfile(enabled && !!user && isCustomer);

    if (!enabled || !user || isAdmin) {
        // Admins have no profile step and are always considered "complete"
        return { isComplete: isAdmin, isLoading: false };
    }

    const query = isBusiness ? businessQuery : customerQuery;

    return {
        isComplete: !!query.data,
        isLoading: query.isLoading,
    };
};