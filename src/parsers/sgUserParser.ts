import DomParser from "./domParser";
import User from "../types/user";
import $ from "../functions/buildDocument";

export default class SgUserParser extends DomParser<User | null> {
    parse(): User | null {
        const userLink = $.maybeOne(this.root, `a[href^="/user/"]:not(:empty)`);
        if (!userLink) {
            return null;
        }

        return {
            name: userLink.textContent || '',
            url: userLink.getAttribute('href') || '',
        }
    }
}
