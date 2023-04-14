import { Listing, User, Watchlist } from "../../models";
import { authenticated } from "../auth/login";
import { Router, Request, Response } from "express";
import { Op } from "sequelize"


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

const otherListings: Router = Router();

otherListings.get("/category_listings", async (_: Request, res: Response): Promise<void> => {
    if (!authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const listings = await Listing.findAll({
            where: {
                finished: false,
                category: "None"
            }
        })
        res.render("listings/category_listings", { listings: listings, username: authenticated.auth, object: categoryObject, value: "" });
    }
})

otherListings.get("/category_listings/:category", async (req: Request, res: Response): Promise<void> => {
    if (!authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const listings: Array<Listing> = await Listing.findAll({
            where: {
                finished: false,
                category: categoryObject[req.params.category as keyof categoryObject]
            }
        })
        if (listings.length == 0) {
            res.render("listings/category_listings", { listings: [], username: authenticated.name, object: categoryObject, value: req.params.category })
        }
        else {
            res.render("listings/category_listings", { listings: listings, username: authenticated.name, object: categoryObject, value: req.params.category })
        }
    }
})

otherListings.get("/watchlist", async (_: Request, res: Response): Promise<void> => {

    if (!authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const users: Array<User> = await User.findAll({
            where: {
                username: authenticated.name.toLowerCase()
            }
        })
        const watchlist: Array<Watchlist> = await Watchlist.findAll({
            where: {
                userId: users[0].id,
                onWatchlist: true
            }
        })
        const entries: number[] = [];
        for (let i = 0; i < watchlist.length; i++) {
            entries.push(watchlist[i].listingId);
        }
        if (entries.length == 0) {
            res.render("listings/watchlist", { listings: [], username: authenticated.name });
        } else {
            const listings = await Listing.findAll({
                where: {
                    id: {
                        [Op.or]: entries
                    }
                }
            })
            res.render("listings/watchlist", { listings: listings, username: authenticated.name })
        }
    }
})



export default otherListings
