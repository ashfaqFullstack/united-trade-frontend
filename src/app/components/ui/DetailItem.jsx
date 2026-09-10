export default function DetailItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />}
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-slate-800">{value || '—'}</p>
            </div>
        </div>
    );
}