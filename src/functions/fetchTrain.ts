import Train from "../types/train";
import parseTrainValue from "./parseTrainValue";
import SteamDiscussionPageParser from "../parsers/steamDiscussionPageParser";
import fetchUrl from "./fetchUrl";
import DiscussionPageUrl from "../urls/discussionPageUrl";
import Giveaway from "../types/giveaway";
import DiscussionGiveawaysFetcher from "../fetchers/discussionGiveawaysFetcher";
import NoEntriesDescriptionParser from "../parsers/noEntriesDescriptionParser";
import Log from '../services/log'

const fetchTrain = (log: Log, train: Train): Promise<Train> => {
    return new Promise<Train>((finalResolve, finalReject) => {
        log.addMessage('Fetching the first page of train');

        fetchUrl({
            method: 'GET',
            url: String(train.url),
        }).then(({responseText: trainPageHtml}) => {
            const firstPage = (new SteamDiscussionPageParser(trainPageHtml)).parse();

            train.noEntriesTitles = (new NoEntriesDescriptionParser(firstPage.description)).parse();

            log.addMessage(`No entry giveaways counter: ${train.noEntriesTitles.length}`);

            train.value = parseTrainValue(train.name);
            log.addMessage(`Train points: ${train.value}`);

            train.lastPageUrl = firstPage.pages === 1
                ? train.url
                : train.url.getTo(firstPage.pages);

            log.addMessage(`Train last page URL: ${train.lastPageUrl}`);

            return train.lastPageUrl!.isFirst()
                ? trainPageHtml
                : fetchUrl({
                    method: 'GET',
                    url: String(train.lastPageUrl),
                }).then(({ responseText }) => responseText);
        }).then(lastPageHtml => {
            return new Promise<Giveaway[]>(giveawaysFetchedResolve => {
                const fetchedGiveaways: Giveaway[] = [];

                (function next(pageIndex: number, pageUrl: DiscussionPageUrl, preloadedHtml?: string) {
                    let readPostFound = false;

                    log.addMessage(`#${pageIndex} (from the end). Found giveaways atm: ${fetchedGiveaways.length}`);

                    (
                        preloadedHtml
                            ? Promise.resolve(preloadedHtml)
                            : fetchUrl({
                                method: 'GET',
                                url: String(pageUrl),
                            }).then(({ responseText }) => responseText)
                    ).then(pageHtml => {
                        return (new DiscussionGiveawaysFetcher((new SteamDiscussionPageParser(pageHtml)).parse()))
                            .setDirection('desc')
                            .setOnBeforePostFetch(post => {
                                if (!readPostFound && !post.unread) {
                                    readPostFound = true;
                                    log.addMessage(`Read post has been found (${post.anchor})`);
                                }

                                if (readPostFound && train.head) {
                                    return false;
                                }

                                return;
                            })
                            .setOnFetched((post, position, giveaways) => {
                                if (giveaways.length === 0 || train.head) {
                                    return;
                                }

                                const giveaway = giveaways[giveaways.length - 1];

                                train.head = {
                                    giveaway,
                                    creator: post.author,
                                    post,
                                    warnings: [],
                                }
                            })
                            .fetch();
                    }).then(giveaways => {
                        fetchedGiveaways.push(...giveaways);

                        if (pageUrl.isFirst() || (readPostFound && fetchedGiveaways.length)) {
                            log.addMessage(`Resolved with ${fetchedGiveaways.length} giveaway(s)`);
                            giveawaysFetchedResolve(fetchedGiveaways);
                            return;
                        }

                        const previousPageUrl = pageUrl.getPrevious();

                        log.addMessage(`Going to load one more page: ${previousPageUrl.toString()}`);

                        next(pageIndex + 1, pageUrl.getPrevious());
                    });
                })(0, train.lastPageUrl!, lastPageHtml);
            });
        }).then(giveaways => {
            train.newNoEntriesGiveaways = giveaways.filter(giveaway => (
                giveaway.endingAt
                    && giveaway.endingAt < new Date()
                    && giveaway.winners && giveaway.winners.length === 0
                    && giveaway.app && !train.noEntriesTitles.includes(giveaway.app.name)
            ));

            log.addMessage(`Giveaways: ${giveaways.length}; Without entries: ${train.newNoEntriesGiveaways.length}`);
        }).catch((error: any) => {
            finalReject(error);
        }).finally(() => {
            console.log({ train });
            finalResolve(train);
        })
    });
};

export default fetchTrain;
