import { FieldError } from "@/types/auth.types";


export const normalizeErrors = (errors: FieldError[] = []): Record<string, string> => {
    return errors.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
    }, {} as Record<string, string>);
};
