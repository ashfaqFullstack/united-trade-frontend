'use client';

import SendTransactionCard from '@/components/wallet/SendTransaction';
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const searchParams = useSearchParams();
    const receiverId = searchParams.get('receiverId');

    return <SendTransactionCard initialReceiverId={receiverId} />;
}