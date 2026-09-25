'use client';

import { useEnableNotifications, useNotificationStatus } from '@/hooks/useNotification';
import { IoNotifications } from 'react-icons/io5';

export default function EnableNotificationsButton() {
    const { mutate: enable, isPending, isSuccess } = useEnableNotifications();
    const { data: status } = useNotificationStatus();
    const isEnabled = isSuccess || status?.enabled === true;

    return (
        <button
            type="button"
            onClick={() => enable()}
            disabled={isEnabled || isPending}
            aria-label={isEnabled ? 'Notifications enabled' : 'Enable Notifications'}
            title={isEnabled ? 'Notifications enabled' : 'Enable Notifications'}
            className={`flex items-center rounded-xl border px-3 py-2 text-sm font-medium transition disabled:opacity-60 ${isEnabled
                ? 'border-yellow-200 text-yellow-500 hover:bg-yellow-50'
                : 'md:gap-2 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
        >
            <IoNotifications className="h-4 w-4" />
            {!isEnabled && (isPending ? 'Enabling...' : 'Enable Notifications')}
        </button>
    );
}