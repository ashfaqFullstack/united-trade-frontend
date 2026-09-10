export default function SelectInput({ label, required, error, options, ...props }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${error
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                {...props}
            >
                <option value="">Select category</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}