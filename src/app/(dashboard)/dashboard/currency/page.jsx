import { notFound } from 'next/navigation';
import CurrencyRateForm from '@/components/Dashboard/Admin/currency/CurrencyRateForm';
import CurrencyRateTable from '@/components/Dashboard/Admin/currency/CurrencyRateTable';
import { SIDEBAR_FEATURES } from '@/const/const';

export default function CurrencyRatesPage() {
    if (!SIDEBAR_FEATURES.CURRENCY_RATES) {
        notFound();
    }

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Currency Rate Management</h2>
                <p className="text-sm text-slate-500">Add or override country exchange rates.</p>
            </div>
            <CurrencyRateForm />
            <CurrencyRateTable />
        </div>
    );
}