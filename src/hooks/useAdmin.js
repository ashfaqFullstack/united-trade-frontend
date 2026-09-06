import { useQuery } from '@tanstack/react-query';
import { getPendingUsers } from '@/services/admin.service';

export const usePendingUsers = (params, enabled = true) => {
    return useQuery({
        queryKey: ['pendingUsers', params],
        queryFn: () => getPendingUsers(params),
        enabled,
    });
};