export default interface FetcherInterface<Output> {
    fetch(...options: any[]): Promise<Output>;
}
