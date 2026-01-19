// src/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, name, error, className = '', ...props }, ref) => {
        return (
            <div>
                <label
                    htmlFor={name}
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                    {label}
                </label>
                <input
                    ref={ref}
                    id={name}
                    name={name}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors ${error
                            ? 'border-red-500 dark:border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                        } ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;