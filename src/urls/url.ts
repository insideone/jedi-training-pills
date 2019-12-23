export default abstract class Url {
    protected url: URL;

    constructor(url: string | URL) {
        this.url = typeof url === 'string' ? new URL(url) : url;
    }

    get value(): URL {
        return this.url;
    }

    toString() {
        return this.value.toJSON();
    }
}
