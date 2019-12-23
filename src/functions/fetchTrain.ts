import Train from "../types/train";
import parseTrainValue from "./parseTrainValue";
import SteamDiscussionPageParser from "../parsers/steamDiscussionPageParser";
import fetchUrl from "./fetchUrl";
import DiscussionPageUrl from "../urls/discussionPageUrl";
import Giveaway from "../types/giveaway";
import DiscussionGiveawaysFetcher from "../fetchers/discussionGiveawaysFetcher";
import NoEntriesDescriptionParser from "../parsers/noEntriesDescriptionParser";

const fetchTrain = (train: Train): Promise<Train> => {
    return new Promise<Train>((finalResolve, finalReject) => {
        fetchUrl({
            method: 'GET',
            url: String(train.url),
        }).then(({responseText: trainPageHtml}) => {
            const firstPage = (new SteamDiscussionPageParser(trainPageHtml)).parse();

            train.noEntriesTitles = (new NoEntriesDescriptionParser(firstPage.description)).parse();

            train.value = parseTrainValue(train.name);
            train.lastPageUrl = firstPage.pages === 1
                ? train.url
                : train.url.getTo(firstPage.pages);

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
                    let stopped = false;

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
                            .setOnBeforePostFetch((post, postIndex) => {
                                if (pageIndex === 0 && postIndex === 0) {
                                    return;
                                }

                                if (!post.unread) {
                                    stopped = true;
                                    return false;
                                }

                                return;
                            })
                            .setOnFetched((post, position, giveaways) => {
                                if (position !== 0 || giveaways.length === 0) {
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

                        if (pageUrl.isFirst() || stopped) {
                            giveawaysFetchedResolve(fetchedGiveaways);
                            return;
                        }

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
        }).catch((error: any) => {
            finalReject(error);
        }).finally(() => {
            console.log({ train });
            finalResolve(train);
        })
    });
};

export default fetchTrain;
