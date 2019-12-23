import getNormalizedGiveawayWinnersUrl from "../../src/functions/getNormalizedGiveawayWinenrsUrl";

test('getNormalizedGiveawayWinnersUrl should not change an url if "winners" already presented', () => {
    const url = 'https://www.steamgifts.com/giveaway/PjsiF/blazblue-chronophantasma-extend/winners';
    const fixedUrl = getNormalizedGiveawayWinnersUrl(url);

    expect(fixedUrl).toBe(url);
});

test('getNormalizedGiveawayWinnersUrl should add "winners" if it is not in passed url', () => {
    const url = 'https://www.steamgifts.com/giveaway/PjsiF/blazblue-chronophantasma-extend';
    const fixedUrl = getNormalizedGiveawayWinnersUrl(url);

    expect(fixedUrl).toBe('https://www.steamgifts.com/giveaway/PjsiF/blazblue-chronophantasma-extend/winners');
});

test('getNormalizedGiveawayWinnersUrl should throw error on relative url', () => {
    expect(() => getNormalizedGiveawayWinnersUrl('/giveaway/PjsiF/blazblue-chronophantasma-extend')).toThrowError();
});
