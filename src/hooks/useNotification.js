import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getNotificationStatus, subscribeToPush } from '@/services/notification.service';
import { registerPushNotifications } from '@/lib/pushNotification';

export const useNotificationStatus = () => {
    return useQuery({
        queryKey: ['notificationStatus'],
        queryFn: getNotificationStatus,
    });
};

export const useEnableNotifications = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const subscription = await registerPushNotifications();
            if (!subscription) throw new Error('Permission denied or unsupported browser');
            await subscribeToPush(subscription);
        },
        onSuccess: () => {
            queryClient.setQueryData(['notificationStatus'], { enabled: true });
            toast.success('Notifications enabled');
        },
        onError: (err) => toast.error(err.message || 'Failed to enable notifications'),
    });
};