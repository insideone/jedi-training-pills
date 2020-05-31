import { RateLimiter } from 'limiter';
import FetcherInterface from "../interfaces/fetcherInterface";
import getCompositeCallback from "../functions/getCompositeCallback";
import Callback from "../types/callback";

export default class HtmlPageFetcher implements FetcherInterface<GM.Response<string>> {
    protected limiter: RateLimiter | null;

    setLimiter(limiter: RateLimiter) {
        this.limiter = limiter;
    }

    fetch(request: GM.Request): Promise<GM.Response<string>> {
        return (new Promise<GM.Request>((resolve, reject) => {
            if (!this.limiter) {
                resolve(request);
                return;
            }

            this.limiter.removeTokens(1, (error: string) => {
                if (error) {
                    reject(`${error} while fetching ${request.url || 'unknown url'}`);
                }

                resolve(request);
            });
        })).then(request => new Promise((resolve, reject) => {
            GM.xmlHttpRequest(Object.assign({}, request, {
                onload: getCompositeCallback([request.onload, resolve].filter(callback => !!callback) as Callback[]),
                onerror: getCompositeCallback([request.onerror, reject].filter(callback => !!callback) as Callback[])
            }));
        }));
    }
}
