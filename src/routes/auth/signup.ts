import { Router, Request, Response } from "express";
import { User, Listing, Watchlist, Comment, Like } from "../../models";
import { authenticated } from "./login";

const signup: Router = Router();

const hashCode = (str: String): number => {
    let hash: number = 0;
    for (let i: number = 0, len = str.length; i < len; i++) {
        let chr: number = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
};

signup.get("/signup", (_: Request, res: Response): void => {
    if (authenticated.auth) {
        res.redirect("/index")
    }
    else {
        res.render("auth/signup")
    }
})

signup.post("/signup", async (req: Request, res: Response) => {
    if (req.body.password != req.body.confirmPassword) {
        console.log(await User.findAll());
        res.render("auth/signup", { different: true })
    }
    else {
        const users: Array<User> = await User.findAll({
            where: {
                username: req.body.username.toLowerCase()
            }
        })
        if (users.length != 0) {
            res.render("auth/signup", { exists: true });
        }
        else {
            authenticated.auth = true;
            authenticated.name = req.body.username;
            const newUser: User = await User.create({ username: req.body.username.toLowerCase(), password: hashCode(req.body.password) });
            const listingLength: number = (await Listing.findAll()).length;
            const commentLength: number = (await Comment.findAll()).length
            const watchlistEntries: Array<{
                userId: number;
                listingId: number;
                onWatchlist: false;
            }> = [];
            const likeEntries: Array<{
                userId: number,
                commentId: number,
                liked: boolean
            }> = [];
            for (let i: number = 1; i <= listingLength; i++) {
                watchlistEntries.push({
                    userId: newUser.id,
                    listingId: i,
                    onWatchlist: false
                });
            }
            for (let i: number = 1; i <= commentLength; i++){
                likeEntries.push({
                    userId: newUser.id,
                    commentId: i,
                    liked: false
                });
            }
            await Watchlist.bulkCreate(watchlistEntries);
            await Like.bulkCreate(likeEntries);
            res.redirect("/index");
        }
    }
})

export default signup