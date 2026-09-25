'use client';

import { useEnableNotifications } from '@/hooks/useNotification';
import { IoNotifications } from 'react-icons/io5';

export default function EnableNotificationsButton() {
    const { mutate: enable, isPending, isSuccess } = useEnableNotifications();

    return (
        <button
            type="button"
            onClick={() => enable()}
            disabled={isSuccess}
            aria-label={isSuccess ? 'Notifications enabled' : 'Enable Notifications'}
            title={isSuccess ? 'Notifications enabled' : 'Enable Notifications'}
            className={`flex items-center rounded-xl border px-3 py-2 text-sm font-medium transition disabled:opacity-60 ${isSuccess
                ? 'border-yellow-200 text-yellow-500 hover:bg-yellow-50'
                : 'gap-2 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
        >
            <IoNotifications className="h-4 w-4" />
            {!isSuccess && (isPending ? 'Enabling...' : 'Enable Notifications')}
        </button>
    );
}