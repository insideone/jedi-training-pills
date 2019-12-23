import DomParser from "./domParser";
import TrainsAnnoncementPage from "../types/trainsAnnoncementPage";
import Train from "../types/train";
import $ from "../functions/buildDocument";
import DiscussionPageUrl from "../urls/discussionPageUrl";

export default class TrainsAnnoncementPageParser extends DomParser<TrainsAnnoncementPage> {
    parse(): TrainsAnnoncementPage {
        const trains: Train[] = [];

        Array.from(document.querySelectorAll('.bodytext a')).map(trainLink => {
            try {
                trains.push({
                    url: new DiscussionPageUrl(trainLink.getAttribute('href') || ''),
                    name: $.previous(trainLink, node => node.nodeType === Node.TEXT_NODE).textContent,
                    problems: [] as string[],
                } as Train)
            } catch (e) {
                // skip?
            }
        });

        return { trains };
    }
}
