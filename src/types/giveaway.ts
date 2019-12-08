import User from "./user";
import App from "./app";
import GiveawayWinnerEntry from "./giveawayWinnerEntry";

type Giveaway = {
    url: string,
    creator?: User | null,
    startedAt?: Date,
    endingAt?: Date,
    app?: App,
    winners: GiveawayWinnerEntry[],
};

export default Giveaway;
