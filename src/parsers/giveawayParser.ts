import Giveaway from "../types/giveaway";
import DomParser from "./domParser";
import $ from "../functions/buildDocument";
import SgUserParser from "./sgUserParser";

export default class GiveawayParser extends DomParser<Giveaway> {
    parse(giveaway: Giveaway): Giveaway {
        const headerNode = $.maybeOne(this.root, '.featured__heading__medium');

        if (!headerNode) {
            giveaway.problems.push(
                $.one(this.root, '.table--summary div:last-child div.table__column--width-fill').textContent as string
            );
            return giveaway;
        }

        const name = (headerNode as Element).textContent;
        const creator = (new SgUserParser($.one(this.root, '.featured__column--width-fill'))).parse();

        const winners = Array.from(this.root.querySelectorAll('.page__inner-wrap .table .table__row-inner-wrap'))
            .map(winnerNode => ({
                user: (new SgUserParser(winnerNode)).parse(),
                status: ($.one(winnerNode, 'div:last-child').textContent || '').trim(),
            }));

        const appUrl = $.one(
            this.root,
            '.featured__inner-wrap a[href^="https://store.steampowered.com/"]'
        ).getAttribute('href') || '';

        return Object.assign(giveaway ? giveaway : {}, {
            creator,
            winners,
            endingAt: $.maybeDate(this.root, '.featured__columns .featured__column:first-child span[data-timestamp]'),
            app: {
                name,
                url: appUrl,
            }
        }) as Giveaway;
    }
}
