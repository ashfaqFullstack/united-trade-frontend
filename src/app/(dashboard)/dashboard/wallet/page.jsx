'use client';

import MyQrCard from '@/components/wallet/qr/MyQrCard';
import SendTransactionCard from '@/components/wallet/SendTransaction';
import TransactionHistory from '@/components/wallet/TransactionHistory';
import WalletOverview from '@/components/wallet/WalletOverview';
import { useState } from 'react';

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'receive', label: 'Receive' },
    { key: 'send', label: 'Send' },
    { key: 'history', label: 'History' },
];

export default function WalletPage() {
    const [tab, setTab] = useState('overview');

    return (
        <div className="space-y-5">
            <div className="flex gap-2 overflow-x-auto">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setTab(t.key)}
                        className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t.key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'overview' && <WalletOverview />}
            {tab === 'receive' && <MyQrCard />}
            {tab === 'send' && <SendTransactionCard />}
            {tab === 'history' && <TransactionHistory />}
        </div>
    );
}