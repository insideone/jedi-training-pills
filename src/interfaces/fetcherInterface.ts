export default interface FetcherInterface<Output> {
    fetch(): Promise<Output>;
}
