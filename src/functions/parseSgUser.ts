import User from "../types/user";
import $ from "./buildDocument";

const parseSgUser = (node: Element | Document, query: string = ''): User | null => {
    const userLink = $.maybeOne(node, `${query} a[href^="/user/"]:not(:empty)`.trim());
    if (!userLink) {
        return null;
    }

    return {
        name: userLink.textContent || '',
        url: userLink.getAttribute('href') || '',
    }
};

export default parseSgUser;
