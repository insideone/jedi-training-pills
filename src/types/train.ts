import Cart from "./cart";

type Train = {
    name: string,
    value: number | null,
    url: string,
    lastPageUrl: string,
    head?: Cart,
    problems: string[],
};

export default Train;
