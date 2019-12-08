import access from "./access";

const singleDestructAccess = <T>(accessor: () => T, defaultValue: T | null = null): (acceptor: (value: typeof defaultValue) => any) => any => {
    return (acceptor: (value: typeof defaultValue) => any) => acceptor(access([accessor], defaultValue)[0]);
};

export default singleDestructAccess;
