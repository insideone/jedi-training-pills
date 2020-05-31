export default class Log {
    private created: number;
    private readonly messages: string[];

    constructor () {
        this.messages = [];
    }

    public addMessage(message: string): void {
        if (!this.created) {
            this.created = Date.now();
        }

        this.messages.push(`[${((Date.now() - this.created) / 1000).toFixed(1)}s] ${message}`);
    }

    public getMessages(): string[] {
        return [...this.messages];
    }

    public get length(): number {
        return this.messages.length;
    }
}
