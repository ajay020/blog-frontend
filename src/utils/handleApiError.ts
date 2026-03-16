import { ApiError } from "./apiError";

export function handleApiError(error: unknown) {
    if (error instanceof ApiError) {
        return {
            message: error.message,
            errors: error.errors || []
        };
    }

    return {
        message: "Unexpected error occurred",
        errors: []
    };
}