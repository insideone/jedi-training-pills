/** @jsx H */
import {H} from 'dot-dom';
import friendlyTime from 'friendly-time';
import Train from "../types/train";
import SteamTable from "./steam/steamTable";
import SteamTr from "./steam/steamTr";
import SteamTh from "./steam/steamTh";
import SteamTd from "./steam/steamTd";
import sgUrl from "../functions/sgUrl";
import access from "../functions/access";
import accessTo from "../functions/accessTo";
import User from "../types/user";

type TrainsProps = {
    trains: Train[],
}

const TrainsReport = (props: TrainsProps) => {
    const { trains } = props;
    return (
        <SteamTable>
            <SteamTr>
                <SteamTh>Name</SteamTh>
                <SteamTh>User</SteamTh>
                <SteamTh>Updated</SteamTh>
                <SteamTh>Giveaway</SteamTh>
                <SteamTh>Store</SteamTh>
                <SteamTh>Ending</SteamTh>
                <SteamTh>Winners</SteamTh>
                <SteamTh>No Entries</SteamTh>
                <SteamTh>Problems</SteamTh>
            </SteamTr>
            {trains.map(train => {
                const user = access([
                    () => ({
                        name: train.head!.giveaway!.creator!.name,
                        url: sgUrl(train.head!.giveaway!.creator!.url),
                    } as User),
                    () => train.head!.creator,
                ]).find(user => user);

                return (
                    <SteamTr>
                        <SteamTd><a href={String(train.url)} target="_blank">{train.name}</a></SteamTd>
                        <SteamTd>{user ? (<a href={user.url} target="_blank">{user.name}</a>) : []}</SteamTd>
                        <SteamTd>{
                            accessTo(() => train.head!.post)(post => (
                                post ? (friendlyTime(
                                    train.head!.post.updatedAt
                                        ? train!.head!.post.updatedAt
                                        : train!.head!.post.createdAt
                                )) : []
                            ))
                        }</SteamTd>
                        <SteamTd>
                            {accessTo(() => ({
                                name: train.head!.giveaway.app!.name,
                                url: train.head!.giveaway.url,
                            }))(giveaway => (
                                giveaway ? (
                                    <a href={giveaway.url} target="_blank">{giveaway.name}</a>
                                ) : []
                            ))}
                        </SteamTd>
                        <SteamTd>
                            {accessTo(() => train.head!.giveaway!.app!.url)(url => (
                                url ? (
                                    <a href={url} target="_blank">
                                        <img src='https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_review_steam.png' alt="" />
                                    </a>
                                ): []
                            ))}
                        </SteamTd>
                        <SteamTd>
                            {accessTo(() => train.head!.giveaway!.endingAt)(endingAt => (
                                endingAt ? friendlyTime(endingAt) : []
                            ))}
                        </SteamTd>
                        <SteamTd>
                            {accessTo(() => train.head!.giveaway!.winners)(winners => (winners || []).map(winner => (
                                winner.status === 'Received' ? (
                                    <a href={sgUrl(winner.user!.url)} target="_blank">{winner.user!.name}</a>
                                ) : (
                                    <span>Anonymous</span>
                                )
                            )))}
                        </SteamTd>
                        <SteamTd>
                            {accessTo(() => train.newNoEntriesGiveaways)(newNoEntriesGiveaways => (
                                (newNoEntriesGiveaways || []).map(noEntriesGa => (
                                    <div>
                                        <a href={noEntriesGa.url}>{
                                            accessTo(() => noEntriesGa.app!.name, 'Unknown')(appName => appName)
                                        }</a>
                                    </div>
                                ))
                            ))}
                        </SteamTd>
                        <SteamTd>{train.problems.map(problem => (<p>{problem}</p>))}</SteamTd>
                    </SteamTr>
                );
            })}
        </SteamTable>
    );
};

export default TrainsReport;
