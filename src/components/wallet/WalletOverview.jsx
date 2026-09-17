'use client';

import { useRouter } from 'next/navigation';
import { FiEye, FiSend, FiCamera as FiScanQr, FiUsers, FiPlusCircle } from 'react-icons/fi';
import { useMyWallet } from '@/hooks/useWallet';
import TransactionHistoryPreview from './TransactionHistoryPreview';
import Loading from '../ui/Loading';
import SetPinCard from './SetPinCard';
import QuickActionButton from './QuickActionButton';

export default function WalletOverview() {
    const { data: wallet, isLoading } = useMyWallet();
    const router = useRouter();

    if (isLoading) {
        return <Loading />;
    }
    if (!wallet) {
        return <div className="p-8 text-center text-sm text-slate-400">Wallet not available.</div>;
    }

    if (!wallet.hasPin) {
        return <SetPinCard onSuccess={() => window.location.reload()} />;
    }

    const available = Number(wallet.balance) + Number(wallet.creditLimit);

    return (
        <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900">My Wallet</h2>

            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                    Total Balance
                    <FiEye className="h-3.5 w-3.5" />
                </div>
                <p className="mt-2 text-3xl font-bold">${Number(wallet.balance).toLocaleString()}</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/10 p-3">
                        <p className="text-[11px] text-white/70">Available Balance</p>
                        <p className="mt-1 text-lg font-bold">${available.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                        <p className="text-[11px] text-white/70">Credit Limit</p>
                        <p className="mt-1 text-lg font-bold">${Number(wallet.creditLimit).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 rounded-2xl border border-slate-100 bg-white p-3">
                <QuickActionButton icon={FiSend} label="Send Money" color="blue" onClick={() => router.push('/dashboard/wallet/send')} />
                <QuickActionButton icon={FiScanQr} label="Scan QR" color="purple" onClick={() => router.push('/dashboard/wallet/qr')} />
                <QuickActionButton icon={FiUsers} label="Request Money" color="emerald" disabled />
                <QuickActionButton icon={FiPlusCircle} label="Add Money" color="amber" disabled />
            </div>

            <TransactionHistoryPreview />
        </div>
    );
}