/** @jsx H */
import Train from "../types/train";
import {H} from "dot-dom";
import isset from "../functions/isset";
import SteamTable from "./steam/steamTable";
import SteamTr from "./steam/steamTr";
import SteamTh from "./steam/steamTh";
import SteamTd from "./steam/steamTd";
import User from "../types/user";
import sgUrl from "../functions/sgUrl";
import GiveawayWinnerEntry from "../types/giveawayWinnerEntry";

type UsersReportProps = {
    trains: Train[],
};

interface UserReportEntryType {
    user: User,
    trains: number,
    points: number,
    wins: number,
}

class UserReportEntry implements UserReportEntryType {
    user: User;
    trains: number = 0;
    points: number = 0;
    wins: number = 0;

    constructor(user: User) {
        this.user = user;
    }
}

const UsersReport = (props: UsersReportProps) => {
    const { trains } = props;

    const report = Object.values(trains.reduce((report, train) => {
        if (!isset(() => train.head!.giveaway.creator!.url)) {
            return report;
        }

        const userUrl = train.head!.giveaway.creator!.url;

        if (!(userUrl in report)) {
            report[userUrl] = new UserReportEntry(train.head!.giveaway.creator as User);
        }

        report[userUrl].trains++;
        if (isset(() => train!.head!.giveaway.winners)) {
            (train!.head!.giveaway!.winners as GiveawayWinnerEntry[]).forEach(winner => {
                if (!winner.user) {
                    return;
                }

                if (!(winner.user.url in report)) {
                    report[winner.user.url] = new UserReportEntry(winner.user);
                }

                report[winner.user.url].points += train!.value || 0;
                report[winner.user.url].wins++;
            })
        }

        return report;
    }, {} as {[key: string]: UserReportEntryType})).sort((leftEntry, rightEntry) => {
        if (leftEntry.points > rightEntry.points) {
            return -1;
        }

        if (leftEntry.points === rightEntry.points) {
            return 0;
        }

        return 1;
    }).reduce((report, entry) => {
        report[entry.user.url] = entry;
        return report;
    }, {} as {[key: string]: UserReportEntryType});

    return (
        <SteamTable>
            <SteamTr>
                <SteamTh>User</SteamTh>
                <SteamTh>Ongoing</SteamTh>
                <SteamTh>Pending</SteamTh>
                <SteamTh>Pending in Points</SteamTh>
            </SteamTr>
            {Object.entries(report).map(([, entry]) => (
                <SteamTr>
                    <SteamTd><a href={sgUrl(entry.user.url)} target="_blank">{entry.user.name}</a></SteamTd>
                    <SteamTd>{entry.trains}</SteamTd>
                    <SteamTd>{entry.wins}</SteamTd>
                    <SteamTd>{entry.points}</SteamTd>
                </SteamTr>
            ))}
        </SteamTable>
    );
};

export default UsersReport;
