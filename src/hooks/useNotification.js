import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subscribeToPush } from '@/services/notification.service';
import { registerPushNotifications } from '@/lib/pushNotification';

export const useEnableNotifications = () => {
    return useMutation({
        mutationFn: async () => {
            const subscription = await registerPushNotifications();
            if (!subscription) throw new Error('Permission denied or unsupported browser');
            await subscribeToPush(subscription);
        },
        onSuccess: () => toast.success('Notifications enabled'),
        onError: (err) => toast.error(err.message || 'Failed to enable notifications'),
    });
};