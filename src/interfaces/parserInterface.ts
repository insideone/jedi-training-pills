export default interface ParserInterface<Output> {
    parse(acceptor?: Output): Output;
}
