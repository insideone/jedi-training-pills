import StringParser from "./stringParser";

export default class NoEntriesDescriptionParser extends StringParser<string[]> {
    public static readonly DEFAULT_MARKER = 'GAs that got NO ENTRIES';

    parse(acceptor?: string[]): string[] {
        const lines = this.input.split("<br>");

        const startPosition = lines.findIndex(line => line.includes(NoEntriesDescriptionParser.DEFAULT_MARKER));

        if (startPosition === -1) {
            return this.getResult(acceptor);
        }

        const entries = lines.slice(startPosition + 1).reduce(
            (stash, entry) => {
                const clearEntry = entry.trim();
                if (!clearEntry || clearEntry.indexOf('-') === 0 || clearEntry.includes('<br')) {
                    return stash;
                }

                stash.push(clearEntry);
                return stash;
            },
            [] as string[]
        );

        return this.getResult(acceptor, entries);
    }

    protected getResult(...batches: (string[] | undefined)[]): string[] {
        return batches.reduce<string[]>(
            (result, batch) => {
                result.push(...(batch ? batch : []));
                return result;
            },
            []
        );
    }
}
