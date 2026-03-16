import { useFormContext } from "react-hook-form";

interface FormInputProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
}

const FormInput = ({
    name,
    label,
    type = "text",
    placeholder,
}: FormInputProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium">{label}</label>

            <input
                {...register(name)}
                type={type}
                placeholder={placeholder}
                className="w-full rounded-lg border px-3 py-2"
            />

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default FormInput;