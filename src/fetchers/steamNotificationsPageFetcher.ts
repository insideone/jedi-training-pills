import FetcherInterface from "../interfaces/fetcherInterface";
import SteamNotificationsPage from "../types/steamNotificationsPage";
import fetchUrl from "../functions/fetchUrl";
import $ from "../functions/buildDocument";
import DiscussionNotification from "../types/discussionNotification";

export default class SteamNotificationsPageFetcher implements FetcherInterface<SteamNotificationsPage> {
    protected url: string;

    constructor(url: string) {
        this.url = url;
    }

    fetch(): Promise<SteamNotificationsPage> {
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

                resolve({
                    url: this.url,
                    notifications,
                });
            });
        });


    }
}
