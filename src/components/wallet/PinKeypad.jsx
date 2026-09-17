'use client';

import { useRef } from 'react';
import { FiDelete, FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';
import { LuLoaderCircle } from 'react-icons/lu';

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'back'];

export default function PinKeypad({
    length = 4,
    value,
    onChange,
    error,
    title,
    subtitle,
    onSubmit,
    isSubmitting,
    submitLabel = 'Continue',
}) {
    const inputRefs = useRef([]);
    const [show, setShow] = useState(false);

    const handleBoxChange = (index, e) => {
        const digit = e.target.value.replace(/\D/g, '').slice(-1);
        const chars = value.split('');
        chars[index] = digit || '';
        const next = chars.join('').slice(0, length);
        onChange(next);

        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleKeypadPress = (key) => {
        if (key === 'back') {
            onChange(value.slice(0, -1));
            return;
        }
        if (value.length < length) {
            onChange(value + key);
        }
    };

    return (
        <div>
            {title && <p className="text-center text-base font-bold text-slate-900">{title}</p>}
            {subtitle && <p className="mt-1 text-center text-sm text-slate-500">{subtitle}</p>}

            {/* Boxes — visible + keyboard-typable on all devices */}
            <div className="mt-5 flex items-center justify-center gap-2">
                <div className="flex gap-2">
                    {Array.from({ length }).map((_, i) => (
                        <input
                            key={i}
                            ref={(el) => (inputRefs.current[i] = el)}
                            type={show ? 'text' : 'password'}
                            inputMode="numeric"
                            maxLength={1}
                            value={value[i] || ''}
                            onChange={(e) => handleBoxChange(i, e)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className={`h-12 w-12 rounded-xl border text-center text-lg font-bold outline-none transition focus:ring-2 ${error
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                                }`}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="ml-1 cursor-pointer text-slate-400 hover:text-slate-600"
                >
                    {show ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
            </div>

            {error && <p className="mt-2 text-center text-xs font-medium text-red-500">{error}</p>}

            {/* On-screen numpad — mobile only */}
            <div className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-3 md:hidden">
                {KEYS.map((key, i) =>
                    key === null ? (
                        <div key={i} />
                    ) : (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleKeypadPress(key)}
                            className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-slate-50 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            {key === 'back' ? <FiDelete className="h-5 w-5" /> : key}
                        </button>
                    )
                )}
            </div>

            {onSubmit && (
                <button
                    type="button"
                    onClick={() => onSubmit(value)}
                    disabled={value.length !== length || isSubmitting}
                    className="mt-6 w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isSubmitting ?
                        <LuLoaderCircle className="h-5 w-5 animate-spin" />
                        : submitLabel}
                </button>
            )}
        </div>
    );
}