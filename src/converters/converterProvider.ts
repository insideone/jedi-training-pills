import ParserInterface from "../interfaces/parserInterface";
import TypeConstructor from "../interfaces/typeConstructor";

export default class ConverterProvider<Input, Output, Parser extends ParserInterface<Output>> {
    protected parserClass: TypeConstructor<Parser>;

    public constructor(ParserClass: TypeConstructor<Parser>) {
        this.parserClass = ParserClass;
    }

    public provide(): (input: Input) => Output {
        return input => (new this.parserClass(input)).parse();
    }
}
