const desctruct = <T>(values: T[]): (acceptor: (values: T[]) => any) => any => {
    return (acceptor: (values: T[]) => any) => acceptor(values);
};

export default desctruct;
