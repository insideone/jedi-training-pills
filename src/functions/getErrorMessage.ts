const getErrorMessage = (error: any): string => {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    if (typeof error === 'object' && typeof error.toString === 'function') {
        return error.toString();
    }

    return typeof error;
};

export default getErrorMessage;
