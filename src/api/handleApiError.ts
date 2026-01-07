import axios from "axios";

export const handleApiError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message ?? "API Error");
    }
    throw new Error("Unexpected error");
};
