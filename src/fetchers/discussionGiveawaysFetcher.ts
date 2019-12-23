import FetcherInterface from "../interfaces/fetcherInterface";
import Giveaway from "../types/giveaway";
import SteamDiscussionPage from "../types/steamDiscussionPage";
import Post from "../types/post";
import Direction from "../types/direction";
import PostGiveawaysFetcher, {OnBeforeGiveawayFetchedCallback} from "./postGiveawaysFetcher";

type OnBeforePostFetchedCallback = (post: Post, postIndex: number) => void | boolean;
type OnFetchedCallback = (post: Post, postIndex: number, giveaways: Giveaway[]) => void | boolean;

export default class DiscussionGiveawaysFetcher implements FetcherInterface<Giveaway[]> {
    protected page: SteamDiscussionPage;
    protected direction: Direction = 'asc';
    protected onBeforeGiveawayFetch: OnBeforeGiveawayFetchedCallback;
    protected onBeforePostFetch: OnBeforePostFetchedCallback;
    protected onFetched: OnFetchedCallback;

    constructor(page: SteamDiscussionPage) {
        this.page = page;
    }

    setOnBeforeGiveawayFetch(callback: OnBeforeGiveawayFetchedCallback): this {
        this.onBeforeGiveawayFetch = callback;
        return this;
    }

    setOnBeforePostFetch(callback: OnBeforePostFetchedCallback): this {
        this.onBeforePostFetch = callback;
        return this;
    }

    setOnFetched(callback: OnFetchedCallback): this {
        this.onFetched = callback;
        return this;
    }

    setDirection(direction: Direction): this {
        this.direction = direction;
        return this;
    }

    fetch(): Promise<Giveaway[]> {
        const giveaways: Giveaway[] = [];
        const fetcher = this;

        const posts = this.direction === 'asc' ? [...this.page.posts] : this.page.posts.reverse();

        return new Promise<Giveaway[]>(resolve => {
            (function next(position: number = 0) {
                if (posts.length === 0) {
                    resolve(giveaways);
                    return;
                }

                const post = posts.shift() as Post;

                // noinspection PointlessBooleanExpressionJS
                if (fetcher.onBeforePostFetch && fetcher.onBeforePostFetch(post, position) === false) {
                    resolve(giveaways);
                    return;
                }

                (new PostGiveawaysFetcher(post))
                    .setDirection(fetcher.direction)
                    .setOnBeforeFetch(fetcher.onBeforeGiveawayFetch)
                    .fetch()
                    .then(incomingGiveaways => {
                        fetcher.onFetched && fetcher.onFetched(post, position, incomingGiveaways);
                        giveaways.push(...incomingGiveaways);
                        next(position + 1);
                    });
            })()
        });
    }
}
