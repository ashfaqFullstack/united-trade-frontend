export default function SocialButton({ label, icon }) {
    return (
        <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
            {icon}
            {label}
        </button>
    );
}