const xmlHttpRequestMaker = <TContext>(
    defaultDetails: Partial<GM.Request>,
    beforeRequest: (request: GM.Request) => Promise<GM.Request> = request => Promise.resolve(request)
) => (
        url: string,
        onload: (response: GM.Response<TContext>) => void,
        onerror: (response: GM.Response<TContext>) => void,
        details: Partial<GM.Request> = {}
    ): void => {

    const request = Object.assign({
        url,
        onload,
        onerror,
    }, defaultDetails, details) as GM.Request;

    beforeRequest(request).then(GM.xmlHttpRequest).catch(request.onerror);
};

export default xmlHttpRequestMaker;
