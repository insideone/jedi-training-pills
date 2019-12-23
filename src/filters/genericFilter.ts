import FilterInterface from "../interfaces/filterInterface";

export default abstract class GenericFilter<Type> implements FilterInterface<Type> {
    protected input: Type;

    constructor(input: Type) {
        this.input = input;
    }

    public abstract filter(): Type;
}
