export default function QuickActionButton({ icon: Icon, label, color = 'blue', onClick, disabled }) {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex flex-col items-center gap-2 rounded-xl p-3 text-center transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorMap[color]}`}>
                <Icon className="h-5 w-5" />
            </span>
            <span className="text-xs font-medium text-slate-600">{label}</span>
        </button>
    );
}