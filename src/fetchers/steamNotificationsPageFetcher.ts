import FetcherInterface from "../interfaces/fetcherInterface";
import SteamNotificationsPage from "../types/steamNotificationsPage";
import fetchUrl from "../functions/fetchUrl";
import $ from "../functions/buildDocument";
import DiscussionNotification from "../types/discussionNotification";
import Log from '../services/log'

export default class SteamNotificationsPageFetcher implements FetcherInterface<SteamNotificationsPage> {
    private log: Log;
    protected url: string;

    constructor(log: Log, url: string) {
        this.log = log;
        this.url = url;
    }

    fetch(): Promise<SteamNotificationsPage> {
        this.log.addMessage(`Trying to backup unread notifications from ${this.url}`);

        return new Promise<SteamNotificationsPage>((resolve) => {
            fetchUrl({
                method: 'GET',
                url: this.url,
            }).then(({ responseText }) => {
                const notifications = Array.from($.all(responseText, '.commentnotification.unread')).map(unreadNode => ({
                    name: $.one(unreadNode, '.commentnotification_title').textContent,
                    url: $.one(unreadNode, 'a[href]').getAttribute('href'),
                    unread: unreadNode.classList.contains('unread'),
                } as DiscussionNotification));

                this.log.addMessage(`Unread notification counter: ${notifications.length}`)

                resolve({
                    url: this.url,
                    notifications,
                });
            });
        });


    }
}
