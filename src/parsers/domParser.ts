import ParserInterface from "../interfaces/parserInterface";
import $ from "../functions/buildDocument";

export default abstract class DomParser<Output> implements ParserInterface<Output> {
    protected root: Element | Document;

    public constructor(root: Element | Document | string) {
        this.root = typeof root === 'string' ? $.from(root) : root;
    }

    public abstract parse(acceptor?: Output): Output;
}
