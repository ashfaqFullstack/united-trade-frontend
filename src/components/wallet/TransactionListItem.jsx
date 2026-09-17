import { FiArrowDownLeft, FiArrowUpRight, FiRefreshCw } from 'react-icons/fi';

const TYPE_META = {
    received: { icon: FiArrowDownLeft, color: 'bg-emerald-50 text-emerald-600', sign: '+' },
    sent: { icon: FiArrowUpRight, color: 'bg-red-50 text-red-600', sign: '-' },
    topup: { icon: FiRefreshCw, color: 'bg-blue-50 text-blue-600', sign: '+' },
};

export default function TransactionListItem({ type, title, subtitle, amount, date }) {
    const meta = TYPE_META[type] || TYPE_META.sent;
    const Icon = meta.icon;

    return (
        <div className="flex items-center justify-between px-1 py-3">
            <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.color}`}>
                    <Icon className="h-4 w-4" />
                </span>
                <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-400">{subtitle}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-sm font-bold ${meta.sign === '+' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {meta.sign}${Number(amount).toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">{date}</p>
            </div>
        </div>
    );
}