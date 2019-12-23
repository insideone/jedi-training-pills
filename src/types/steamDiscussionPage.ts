import Post from "./post";

type SteamDiscussionPage = {
    topic: string,
    description: string,
    pages: number,
    posts: Post[],
};

export default SteamDiscussionPage;
