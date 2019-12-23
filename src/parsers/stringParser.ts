import ParserInterface from "../interfaces/parserInterface";

export default abstract class StringParser<Output> implements ParserInterface<Output> {
    protected input: string;

    public constructor(input: string) {
        this.input = input;
    }

    public abstract parse(acceptor?: Output): Output;
}
