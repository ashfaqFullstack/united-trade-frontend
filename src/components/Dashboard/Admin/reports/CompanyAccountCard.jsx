'use client';

import { useState } from 'react';
import { FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useCompanyAccount } from '@/hooks/useReports';
import FundWalletModal from './FundWalletModal';
import Loading from '@/components/ui/Loading';

export default function CompanyAccountCard() {
    const { data: account, isLoading } = useCompanyAccount();
    const [fundModalOpen, setFundModalOpen] = useState(false);

    if (isLoading) return <Loading />;

    return (
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                    <FiDollarSign className="h-4 w-4" />
                    Company Account Balance
                </div>
                <button
                    type="button"
                    onClick={() => setFundModalOpen(true)}
                    className="rounded-lg bg-white/15 cursor-pointer px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
                >
                    Fund My Wallet
                </button>
            </div>
            <p className="mt-3 text-3xl font-bold">${Number(account?.totalBalance ?? 0).toLocaleString()}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-white/70">
                <FiTrendingUp className="h-3.5 w-3.5" />
                Accumulated from trade commissions and membership fees
            </p>

            <FundWalletModal
                open={fundModalOpen}
                onClose={() => setFundModalOpen(false)}
                companyBalance={account?.totalBalance}
            />
        </div>
    );
}