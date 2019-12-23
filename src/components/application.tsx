/** @jsx H */
import {H} from 'dot-dom';
import Button from "./button";
import Train from "../types/train";
import fetchTrain from "../functions/fetchTrain";
import TrainsReport from "./trainsReport";
import UsersReport from "./usersReport";
import getErrorMessage from "../functions/getErrorMessage";
import TrainsAnnoncementPageParser from "../parsers/trainsAnnoncementPageParser";
import TrainsFilter from "../filters/trainsFilter";
import DiscussionNotification from "../types/discussionNotification";
import SteamNotificationsPageFetcher from "../fetchers/steamNotificationsPageFetcher";
import $ from "../functions/buildDocument";

type ApplicationState = {
    trains: Train[],
    notifications: DiscussionNotification[],
    trainsCount: number,
    errors: string[],
    loading: boolean,
};

const skippedTrains = [
    'Birthday Train',
    'Christmas Train',
    'New Year Train',
    'Jedi Train',
    'Mystery Train',
];

const skippedTrainsRegex = /Monthly Train/;

const Application = (props: object, state: ApplicationState, setState: (state: Partial<ApplicationState>) => void) => {
    const {
        trains = [],
        notifications = [],
        errors = [],
        trainsCount = 0,
        loading = false,
    } = state;

    const loadTrains = () => {
        let trainsStash: Train[] = (new TrainsAnnoncementPageParser(document.body)).parse().trains;

        trainsStash = (new TrainsFilter(trainsStash))
            .addNameExcludes(skippedTrains)
            .addNameRegexExcludes([skippedTrainsRegex])
            .filter()
        ;

        // for a debug purpose
        // trainsStash = trainsStash.filter(train => (
        //    [
        //        'Highest Quality NON-Bundled Train',
        //        '21P Train',
        //        '22P Train',
        //    ].includes(train.name)
        // ));

        const allowedTrainNames = trainsStash.map(train => train.name);

        while (trains.length) { trains.pop() }
        while (errors.length) { errors.pop() }

        setState({
            loading: true,
            trainsCount: trainsStash.length,
            trains,
            notifications,
            errors,
        });

        const activeNotificationNode = $.maybeOne(document.body, 'a.active_inbox_item[href$="/commentnotifications/"]');

        Promise.all([
            activeNotificationNode ? (
                (new SteamNotificationsPageFetcher(activeNotificationNode.getAttribute('href') as string))
                    .fetch()
                    .then(notificationPage => {
                        const alreadySavedNotifications = notifications.map(notification => notification.name);
                        const beforeCnt = alreadySavedNotifications.length;

                        const newNotifications = notificationPage.notifications
                            .filter(notification => (
                                notification.url.indexOf('?tscn=') !== undefined
                                    && allowedTrainNames.includes(notification.name)
                                    && notification.unread
                                    && !alreadySavedNotifications.includes(notification.name)
                            ));

                        notifications.push(...newNotifications);

                        if (beforeCnt !== notifications.length) {
                            setState({ notifications });
                        }
                    })
            ) : Promise.resolve(),
            (new Promise<void>(resolve => {
                (function next(restTrains) {
                    if (restTrains.length === 0) {
                        resolve();
                        return;
                    }

                    const train = restTrains.shift() as Train;

                    fetchTrain(train).then(() => {}).catch(error => {
                        console.log({ error });
                        train.problems.push(getErrorMessage(error));
                    }).finally(() => {
                        trains.push(train);
                        setState({ trains });
                        next(restTrains);
                    });
                })(trainsStash);
            }))
        ]).finally(() => {
            setState({ loading: false })
        })
    };

    return (
        <div className={'jedi-training-pills'}>
            <Button onclick={loading
                ? () => alert("Restarting isn't supported. Please, wait until finished or reload the page")
                : loadTrains
            }>
                Report
                {trainsCount > 0 ? (
                    <span> ({`${trains.length}/${trainsCount}`})</span>
                ): []}
            </Button>
            <hr />
            {trains.length > 0 ? (
                <div>
                    <h2>By Train</h2>
                    <TrainsReport trains={trains}/>
                    <hr />
                    <h2>By User</h2>
                    <UsersReport trains={trains}/>
                    <hr />
                </div>
            ) : []}
            {notifications.length > 0 ? (
                <div>
                    <h2>Unread Backup</h2>
                    <ul>
                        {notifications.map(notification => (
                            <li><a href={notification.url}>{notification.name}</a></li>
                        ))}
                    </ul>
                </div>
            ) : []}
            {errors.length > 0 ? (
                <div>
                    <h2>Errors</h2>
                    <ul>
                        {errors.map(error => (<li>{error}</li>))}
                    </ul>
                </div>
            ) : []}
        </div>
    );
};

export default Application;
