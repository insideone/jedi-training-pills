import Url from "./url";

export default class DiscussionPageUrl extends Url {
    get currentPage() {
        return Number(this.url.searchParams.get('ctp') || '1');
    }

    getNext(shift: number = 1): DiscussionPageUrl {
        return this.getTo(this.currentPage + shift);
    }

    getPrevious(shift: number = 1): DiscussionPageUrl {
        return this.getTo(this.currentPage - shift);
    }

    getTo(page: number): DiscussionPageUrl {
        const url = new URL('', this.url);
        if (page > 1) {
            url.searchParams.set('ctp', String(page));
        } else {
            url.searchParams.delete('ctp');
        }

        return new DiscussionPageUrl(url);
    }

    getFirst(): DiscussionPageUrl {
        const url = new URL('', this.url);
        url.searchParams.delete('ctp');
        return new DiscussionPageUrl(url);
    }

    isFirst(): boolean {
        return [null, '1'].includes(this.url.searchParams.get('ctp'));
    }
}
