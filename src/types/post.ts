import User from "./user";

type Post = {
    anchor: string,
    author: User,
    createdAt: Date,
    updatedAt: Date | null,
    unread: boolean,
    giveaways: string[],
};

export default Post;
