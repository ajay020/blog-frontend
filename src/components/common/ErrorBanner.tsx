const ErrorBanner = ({ message }: { message?: string }) =>
    message ? (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
            {message}
        </div>
    ) : null;

export default ErrorBanner