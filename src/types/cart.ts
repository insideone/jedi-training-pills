import User from "./user";
import Giveaway from "./giveaway";
import Post from "./post";

type Cart = {
    creator: User,
    giveaway: Giveaway,
    post: Post,
    warnings: string[],
};

export default Cart;
