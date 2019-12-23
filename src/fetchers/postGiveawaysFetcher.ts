import FetcherInterface from "../interfaces/fetcherInterface";
import Giveaway from "../types/giveaway";
import Post from "../types/post";
import fetchUrl from "../functions/fetchUrl";
import GiveawayParser from "../parsers/giveawayParser";
import getErrorMessage from "../functions/getErrorMessage";
import Direction from "../types/direction";
import getNormalizedGiveawayWinnersUrl from "../functions/getNormalizedGiveawayWinenrsUrl";

type OnBeforeGiveawayFetchedCallback = (post: Post, giveaway: Giveaway, giveawayPosition?: number) => void | boolean;

export default class PostGiveawaysFetcher implements FetcherInterface<Giveaway[]> {
    protected post: Post;
    protected direction: Direction = 'asc';
    protected onBeforeFetch: OnBeforeGiveawayFetchedCallback | null = null;

    constructor(post: Post) {
        this.post = post;
    }

    setDirection(direction: Direction): this {
        this.direction = direction;
        return this;
    }

    setOnBeforeFetch(stopper: OnBeforeGiveawayFetchedCallback): this {
        this.onBeforeFetch = stopper;
        return this;
    }

    fetch(): Promise<Giveaway[]> {
        const giveaways: Giveaway[] = [];
        const fetcher = this;
        const giveawayUrls = this.direction === 'asc'
            ? [...this.post.giveaways]
            : this.post.giveaways.reverse();

        return new Promise<Giveaway[]>(resolve => {
            (function next(giveawayIndex: number = 0) {
                if (giveawayUrls.length === 0) {
                    resolve(giveaways);
                    return;
                }

                const giveaway = {
                    url: giveawayUrls.shift(),
                    problems: [],
                } as Giveaway;

                giveaways.push(giveaway);

                try {
                    // noinspection PointlessBooleanExpressionJS
                    if (fetcher.onBeforeFetch && fetcher.onBeforeFetch(fetcher.post, giveaway, giveawayIndex) === false) {
                        resolve(giveaways);
                        return;
                    }
                } catch (e) {
                    giveaway.problems.push(getErrorMessage(e));
                    resolve(giveaways);
                    return;
                }

                fetchUrl({
                    method: 'GET',
                    url: getNormalizedGiveawayWinnersUrl(giveaway.url),
                }).then(({ responseText }) => {
                    (new GiveawayParser(responseText)).parse(giveaway);
                    next(giveawayIndex + 1);
                })
            })();
        })
    }
}

export { OnBeforeGiveawayFetchedCallback }
