import NoEntriesDescriptionParser from "../../src/parsers/noEntriesDescriptionParser";

test('NoEntriesDescriptionParser.parse works correct with regular input', () => {
    const description = `
    I will start the 1P Train runnin.<br>Whoever wins the GA from the 1P Train must make the next GA for this Train within 3 days and must run for 1 to 3 days<br><br>Post you 1P Train GA's Here<br><br>------------------------------------<br>GAs that got NO ENTRIES<br>------------------------------------<br><br>Accurate Segmentation<br>Cyber Gun<br>DISTRAINT: Deluxe Edition<br>Marble Duel<br>Pixelord<br>Ruin City Gasolina<br>Space Pilgrim Episode I: Alpha Centauri<br>The Last Door - Collector's Edition<br>Timberman\t
    `;

    const result = (new NoEntriesDescriptionParser(description)).parse();

    expect(result).toStrictEqual([
        'Accurate Segmentation',
        'Cyber Gun',
        'DISTRAINT: Deluxe Edition',
        'Marble Duel',
        'Pixelord',
        'Ruin City Gasolina',
        'Space Pilgrim Episode I: Alpha Centauri',
        'The Last Door - Collector\'s Edition',
        'Timberman',
    ]);
});

test('NoEntriesDescriptionParser.parse works correct with empty list', () => {
    const description = `
    I will start the 1P Train runnin.<br>Whoever wins the GA from the 1P Train must make the next GA for this Train within 3 days and must run for 1 to 3 days<br><br>Post you 1P Train GA's Here<br><br>------------------------------------<br>GAs that got NO ENTRIES<br>------------------------------------<br>
    `;

    const result = (new NoEntriesDescriptionParser(description)).parse();

    expect(result).toStrictEqual([]);
});

test('NoEntriesDescriptionParser.parse works correct with empty input', () => {
    const result = (new NoEntriesDescriptionParser('')).parse();
    expect(result).toStrictEqual([]);
});
