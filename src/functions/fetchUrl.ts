import { RateLimiter } from 'limiter';
import getCompositeCallback from "./getCompositeCallback";
import Callback from "../types/callback";

const limiter = new RateLimiter(2, 'second');

async function fetchUrl<T = string>(request: GM.Request): Promise<GM.Response<T>> {
    console.log(`${request.method} ${request.url}`);

    return (new Promise<GM.Request>((resolve, reject) => {
        limiter.removeTokens(1, (error: string) => {
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

export default fetchUrl;
