import DomParser from "./domParser";
import SteamDiscussionPage from "../types/steamDiscussionPage";
import $ from "../functions/buildDocument";
import Post from "../types/post";

export default class SteamDiscussionPageParser extends DomParser<SteamDiscussionPage> {
    parse(): SteamDiscussionPage {
        const topic = ($.one(this.root, '.forum_op .topic').textContent || '').trim();
        const description = $.one(this.root, '.forum_op .content').innerHTML as string;

        const paging = $.one(this.root, '.forum_paging_summary');
        const pages = Math.ceil(
            Number($.one(paging, '[id$="pagetotal"]').textContent) /
            Number($.one(paging, '[id$="pageend"]').textContent)
        );

        const posts = Array.from($.all(this.root, '.commentthread_comments .commentthread_comment')).map(post => {
            if (post.classList.contains('commentthread_deleted_comment')) {
                return null;
            }

            try {
                const authorLink = $.one(post, '.commentthread_author_link');
                const anchor = $.one(post, '.forum_comment_permlink a').getAttribute('href');
                const createdAt = $.date(post, '.commentthread_comment_timestamp');
                const updatedAt = $.maybeDate(post, '.forum_audit span[data-timestamp]');
                const giveaways = Array.from($.all(post,'.bb_link[href*="https://www.steamgifts.com/giveaway"]')).map(giveawayUrlNode => (
                    giveawayUrlNode.textContent
                ));
                const unread = post.classList.contains('commentthread_newcomment');
                return {
                    anchor,
                    createdAt,
                    updatedAt,
                    unread,
                    giveaways,
                    author: {
                        name: $.one(authorLink, 'bdi').textContent || '',
                        url: authorLink.getAttribute('href') || '',
                    },
                } as Post;
            } catch (e) {
                if (!confirm(`An error occurred while parsing a post from '${topic}' topic: ${e.message}\n\n\nComplete post HTML: ${post.outerHTML}`)) {
                    throw e;
                }
                return null;
            }
        }).filter(post => !!post) as Post[];

        return {
            topic,
            description,
            posts,
            pages,
        };
    }
}
