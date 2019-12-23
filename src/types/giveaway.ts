import User from "./user";
import App from "./app";
import GiveawayWinnerEntry from "./giveawayWinnerEntry";

type Giveaway = {
    url: string,
    creator?: User | null,
    startedAt?: Date | null,
    endingAt?: Date | null,
    app?: App,
    winners?: GiveawayWinnerEntry[],
    problems: string[],
};

export default Giveaway;
