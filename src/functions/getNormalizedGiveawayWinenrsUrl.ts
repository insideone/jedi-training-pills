const getNormalizedGiveawayWinnersUrl = (rawUrl: string): string => {
    const url = new URL(rawUrl);

    let urlPathParts = url.pathname.split('/');
    if (urlPathParts.length < 4) {
        urlPathParts.push('_');
    }

    urlPathParts = urlPathParts.slice(0, 4);
    urlPathParts.push('winners');

    url.pathname = urlPathParts.join('/');
    return url.toJSON();
};

export default getNormalizedGiveawayWinnersUrl;
