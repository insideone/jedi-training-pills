import Cart from "./cart";
import DiscussionPageUrl from "../urls/discussionPageUrl";
import Giveaway from "./giveaway";

type Train = {
    name: string,
    value: number | null,
    url: DiscussionPageUrl,
    lastPageUrl?: DiscussionPageUrl,
    head?: Cart,
    newNoEntriesGiveaways?: Giveaway[],
    noEntriesTitles: string[],
    problems: string[],
};

export default Train;
