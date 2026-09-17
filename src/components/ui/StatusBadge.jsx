const STYLES = {
    ESCROW_HELD: 'bg-blue-50 text-blue-600',
    COMPLETED: 'bg-emerald-50 text-emerald-600',
    CANCELLED: 'bg-red-50 text-red-500',
    PENDING: 'bg-amber-50 text-amber-600',
    ACCEPTED: 'bg-emerald-50 text-emerald-600',
    REJECTED: 'bg-red-50 text-red-500',
};

const LABELS = {
    ESCROW_HELD: 'Escrow Held',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
};

export default function StatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status] || 'bg-slate-100 text-slate-500'}`}>
            {LABELS[status] || status}
        </span>
    );
}