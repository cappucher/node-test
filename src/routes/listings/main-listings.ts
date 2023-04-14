import { authenticated } from "../auth/login";
import { Router, Request, Response } from "express";
import { User, Listing, Watchlist, Comment, Like } from "../../models";

const mainListings = Router();

const findDate = (): string => {
    let today: Date = new Date();
    const dd: string = String(today.getDate()).padStart(2, '0');
    const mm: string = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy: string = today.getFullYear().toString();
    const date: string = mm + '/' + dd + '/' + yyyy;
    return date;
}


interface categoryObject {
    books: string,
    business: string,
    clothing: string,
    collectibles: string,
    electronics: string,
    crafts: string,
    dolls: string,
    home: string,
    motors: string,
    pets: string,
    sports: string,
    shop: string,
    toys: string,
    antiques: string,
    computers: string,
    none: string

}
const categoryObject: categoryObject = {
    "books": "Books",
    "business": "Business & Industrial",
    "clothing": "Clothing, Shoes, & Accesories",
    "collectibles": "Collectibles",
    "electronics": "Consumer Electronics",
    "crafts": "Crafts",
    "dolls": "Dolls & Bears",
    "home": "Home & Garden",
    "motors": "Motors",
    "pets": "Pet Supplies",
    "sports": "Sporting Goods",
    "shop": "Sports Mem, Cards, & Fan Shop",
    "toys": "Toys & Hobbies",
    "antiques": "Antiques",
    "computers": "Computers/Tablets & Networking",
    "none": "None",
}

mainListings.get("/create_listing", async (_: Request, res: Response): Promise<void> => {
    if (!authenticated.auth) {
        res.redirect("/login")
    }
    res.render("listings/new_listing", { authentication: authenticated.auth, username: authenticated.name })
});

mainListings.get("/active_listings", async (_: Request, res: Response): Promise<void> => {
    if (!authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const listings: Array<Listing> = await Listing.findAll({
            where: {
                finished: false
            }
        })
        res.render("listings/active_listings", {
            listings: listings,
            username: authenticated.name
        })
    }
})

mainListings.post("/create_listing", async (req: Request, res: Response): Promise<void> => {
    const newListing: Listing = await Listing.create({ title: req.body.listing, description: req.body.description, bid: req.body.bid, dateOfCreation: findDate(), dateOfFinishing: "false", creator: authenticated.name, link: req.body.image, category: Object.keys(categoryObject).find(key => categoryObject[key as keyof categoryObject] === req.body.category), finished: false });
    const userLength: number = (await User.findAll()).length;
    const entries: Array<{
        userId: number,
        listingId: number,
        onWatchlist: boolean
    }> = [];
    for (let i = 1; i <= userLength; i++) {
        entries.push({
            userId: i,
            listingId: newListing.id,
            onWatchlist: false
        });
    }
    await Watchlist.bulkCreate(entries);
    res.redirect("/index");
})

mainListings.get("/listings/:listing", async (req: Request, res: Response): Promise<void> => {
    if (!authenticated.auth) {
        res.redirect("/login")
    }
    else {
        const comments: Array<Comment> = await Comment.findAll({
            where: {
                listingId: parseInt(req.params.listing)
            }
        })
        const listing: Array<Listing> = await Listing.findAll({
            where: {
                id: parseInt(req.params.listing)
            }
        });
        const id: Array<User> = await User.findAll({
            where: {
                username: authenticated.name.toLowerCase()
            }
        })
        const onWatchlist: Array<Watchlist> = await Watchlist.findAll({
            where: {
                userid: id[0].id,
                listingid: parseInt(req.params.listing)
            }
        })
        res.render("listings/listing", { username: authenticated.name, info: listing[0], watchlist: (onWatchlist.length > 0 && !onWatchlist[0].onWatchlist) ? "Add to " : "Remove from", comments: comments })
    }
})

mainListings.post("/comment/:listing", async (req: Request, res: Response) => {
    const userId: number = (await User.findAll({
        where: {
            username: authenticated.name
        }
    }))[0].id
    const newComment = await Comment.create({ userId: userId, listingId: parseInt(req.params.listing), textContent: req.body.textContent, dateOfCreation: findDate(), creator: authenticated.name });
    const userLength: number = (await User.findAll()).length;
    const entries: Array<{
        userId: number,
        commentId: number,
        liked: boolean
    }> = [];
    for (let i = 1; i <= userLength; i++) {
        entries.push({
            userId: i,
            commentId: newComment.id,
            liked: false
        });
    }
    await Like.bulkCreate(entries);
    res.redirect(`/listings/${req.params.listing}`);
})

mainListings.post("/comment2/:comment", async (req: Request, res: Response): Promise<void> => {
    const userId: number = (await User.findAll({
        where: {
            username: authenticated.name.toLowerCase()
        }
    }))[0].id
    const likedStatus: boolean = (await Like.findAll({
        where: {
            userId: userId,
            commentId: parseInt(req.params.comment)
        }
    }))[0].liked;
    const numLikes: number = (await Comment.findAll({
        where: {
            id: parseInt(req.params.comment)
        }
    }))[0].likes;
    await Like.update({ liked: !likedStatus }, {
        where: {
            userId: userId,
            commentId: parseInt(req.params.comment)
        }
    })
    await Comment.update({ likes: likedStatus ? numLikes - 1 : numLikes + 1 }, {
        where: {
            id: parseInt(req.params.comment)
        }
    })
    const listingId: number = (await Comment.findAll({
        where: {
            id: parseInt(req.params.comment)
        }
    }))[0].listingId
    res.redirect(`/listings/${listingId}`);
})

mainListings.post("/listings/:listing", async (req: Request, res: Response): Promise<void> => {
    if (!authenticated.auth) {
        res.redirect("/login")
    }
    else if (parseFloat(req.body.bid) > 1_000_000_000){
        res.redirect(`/listings/${req.params.listing}`)
    }
    else {
        await Listing.update({ bid: parseFloat(req.body.bid), winner: authenticated.name }, {
            where: {
                id: parseInt(req.params.listing)
            }
        });
        const comments: Array<Comment> = await Comment.findAll({
            where: {
                listingId: parseInt(req.params.listing)
            }
        })
        const listing: Array<Listing> = await Listing.findAll({
            where: {
                id: parseInt(req.params.listing)
            }
        });
        const id: Array<User> = await User.findAll({
            where: {
                username: authenticated.name.toLowerCase()
            }
        })
        const onWatchlist: Array<Watchlist> = await Watchlist.findAll({
            where: {
                userid: id[0].id,
                listingid: req.params.listing
            }
        })
        res.render("listings/listing", { username: authenticated.name, info: listing[0], watchlist: !onWatchlist[0].onWatchlist ? "Add to " : "Remove from", comments: comments })
    }
})

mainListings.get("/editlistings/:listing", async (req: Request, res: Response): Promise<void> => {
    const name: string = (await Listing.findAll({
        where: {
            id: parseInt(req.params.listing)
        }
    }))[0].creator
    if (!authenticated.auth) {
        res.redirect("/login")
    }
    else if (authenticated.name != name){
        res.redirect(`/listings/${parseInt(req.params.listing)}`);
    }
    else{
        const listingInfo: Listing = (await Listing.findAll({
            where: {
                id: parseInt(req.params.listing)
            }
        }))[0];
        console.log(listingInfo.category)
        res.render("listings/edit_listing", {username: authenticated.name, info: listingInfo, object: categoryObject});
    }
})

mainListings.post("/listings2/:listing", async (req: Request, res: Response): Promise<void> => {
    if (!authenticated.auth) {
        res.redirect("/login")
    }
    else {
        const user: Array<User> = await User.findAll({
            where: {
                username: authenticated.name.toLowerCase()
            }
        })
        const watchlistStatus: boolean = (await Watchlist.findAll({
            where: {
                userId: user[0].id,
                listingId: parseInt(req.params.listing)
            }
        }))[0].onWatchlist;
        await Watchlist.update({ onWatchlist: !watchlistStatus }, {
            where: {
                userId: user[0].id,
                listingId: parseInt(req.params.listing)
            }
        })
        res.redirect(`/listings/${req.params.listing}`);
    }
})



export default mainListings
