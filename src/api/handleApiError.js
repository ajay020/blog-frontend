export const handleApiError = (error) => {
    const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

    throw new Error(message);
};
