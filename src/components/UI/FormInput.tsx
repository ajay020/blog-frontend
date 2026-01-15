import { ChangeEvent } from "react";

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
    label,
    name,
    type = "text",
    value,
    placeholder,
    onChange,
}: FormInputProps) => {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <input
                required
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 dark:border-slate-700
                   text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900
                   px-3 py-2 text-sm
                   focus:border-blue-500 focus:outline-none
                   focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
            />
        </div>
    );
};

export default FormInput;
