import { RateLimiter } from 'limiter';
import Train from "../types/train";
import getNormalizedGiveawayWinnersUrl from "./getNormalizedGiveawayWinenrsUrl";
import parseSgUser from "./parseSgUser";
import Giveaway from "../types/giveaway";
import $ from "./buildDocument";
import GiveawayWinnerEntry from "../types/giveawayWinnerEntry";
import parseTrainValue from "./parseTrainValue";
import xmlHttpRequestMaker from "./xmlHttpRequestMaker";

const limiter = new RateLimiter(2, 'second');

let lastLoadedUrl: string | null = null;
const fetchUrl = xmlHttpRequestMaker({ method: 'GET' }, request => {
    lastLoadedUrl = request.url;

    return new Promise((resolve, reject) => {
       limiter.removeTokens(1, (error: string) => {
           if (error) {
               reject(`${error} while fetching ${lastLoadedUrl || 'unknown url'}`);
           }

           resolve(request);
       });
    });
});

const fetchTrain = (train: Train): Promise<Train> => {
    return new Promise<Train>((finalResolve, finalReject) => {
        return (new Promise<string>((resolve, reject) => (
            fetchUrl(
                train.url,
                ({ responseText: trainPageHtml }) => resolve(trainPageHtml),
                reject
            )
        ))).then(trainPageHtml => {
            const trainPage = $.from(trainPageHtml);
            const paging = $.one(trainPage, '.forum_paging_summary');

            const lastPage = Math.ceil(
                Number($.one(paging, '[id$="pagetotal"]').textContent) /
                Number($.one(paging, '[id$="pageend"]').textContent)
            );

            const lastPageUrl = new URL(train.url);
            lastPageUrl.searchParams.set('ctp', String(lastPage));

            const trainName = $.one(trainPage, '.forum_op .topic').textContent as string;

            train.value = parseTrainValue(trainName);
            train.lastPageUrl = String(lastPageUrl);
        }).then(() => {
            return new Promise<string>((resolve, reject) => (
                fetchUrl(
                    train.lastPageUrl,
                    ({responseText}) => resolve(responseText),
                    reject
                )
            ))
        }).then(lastPageHtml => {
            const lastComment = $.one(lastPageHtml, '.commentthread_comment:last-child');
            const authorLink = $.one(lastComment, '.commentthread_author_link');

            let giveawayLink;
            try {
                giveawayLink = $.last(lastComment,'.bb_link[href*="https://www.steamgifts.com/giveaway"]');
            } catch (e) {
                finalReject("Can't find a giveaway url in the last post of topic. Is it derailed?");
                return;
            }

            train.head = {
                giveaway: {
                    winners: [],
                    url: getNormalizedGiveawayWinnersUrl(giveawayLink.textContent || ''),
                },
                creator: {
                    name: $.one(authorLink, 'bdi').textContent || '',
                    url: authorLink.getAttribute('href') || '',
                },
                post: {
                    url: train.url + $.one(lastComment, '.forum_comment_permlink a').getAttribute('href'),
                    createdAt: $.date(lastComment, '.commentthread_comment_timestamp'),
                    updatedAt: $.maybeDate(lastComment, '.forum_audit span[data-timestamp]'),
                },
                warnings: [],
            };
        }).then(() => {
            return new Promise<string>((resolve, reject) => (
                fetchUrl(
                    train.head!.giveaway.url,
                    ({responseText}) => resolve(responseText),
                    reject,
                )
            ));
        }).then(giveawayHtml => {
            const giveawayPage = $.from(giveawayHtml);
            let giveawayName: string;

            try {
                giveawayName = $.one(giveawayPage, '.featured__heading__medium').textContent || 'Unknown';
            } catch (e) {
                finalReject("Can't find the giveaway name. Is it deleted?");
                return;
            }

            Object.assign(train.head!.giveaway, {
                endingAt: $.maybeDate(giveawayPage, '.featured__columns .featured__column:first-child span[data-timestamp]'),
                creator: parseSgUser(giveawayPage, '.featured__column--width-fill'),
                winners: Array.from(
                    giveawayPage.querySelectorAll('.page__inner-wrap .table .table__row-inner-wrap')
                ).map(winnerNode => {
                    return {
                        user: parseSgUser(winnerNode),
                        status: ($.one(winnerNode, 'div:last-child').textContent || '').trim(),
                    } as GiveawayWinnerEntry;
                }),
                app: {
                    name: giveawayName,
                    url: $.one(giveawayPage, '.featured__inner-wrap a[href^="https://store.steampowered.com/"]')
                        .getAttribute('href') || '',
                }
            } as Giveaway);
        }).catch(error => {
            finalReject(error);
        }).finally(() => {
            console.log({ train });
            finalResolve(train);
        })
    });
};

export default fetchTrain;
