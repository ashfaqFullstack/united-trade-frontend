'use client';

import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function FormField({ label, icon: Icon, type = 'text', hint, isPassword, ...props }) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
            <div className="relative">
                {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
                <input
                    type={isPassword ? (show ? 'text' : 'password') : type}
                    className={`w-full rounded-xl border border-slate-200 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${Icon ? 'pl-9' : 'pl-3'
                        } ${isPassword ? 'pr-9' : 'pr-3'}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {show ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
            {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
    );
}