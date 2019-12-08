const getErrorMessage = (error: any): string => {
    return error instanceof Error ? error.message : (typeof error === 'string' ? error : String(error));
};

export default getErrorMessage;
