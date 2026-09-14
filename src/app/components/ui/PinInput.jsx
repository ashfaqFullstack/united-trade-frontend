'use client';

import { useRef } from 'react';

export default function PinInput({ length = 4, value, onChange, error }) {
    const inputRefs = useRef([]);

    const handleChange = (index, e) => {
        const digit = e.target.value.replace(/\D/g, '').slice(-1);
        const chars = value.split('');
        chars[index] = digit;
        const next = chars.join('').padEnd(0, '').slice(0, length);
        onChange(chars.join('').slice(0, length));

        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div>
            <div className="flex justify-center gap-2">
                {Array.from({ length }).map((_, i) => (
                    <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        value={value[i] || ''}
                        onChange={(e) => handleChange(i, e)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`h-12 w-12 rounded-xl border text-center text-lg font-bold outline-none transition focus:ring-2 ${error
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                            }`}
                    />
                ))}
            </div>
            {error && <p className="mt-2 text-center text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}