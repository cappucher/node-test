"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("../auth/login");
const express_1 = require("express");
const models_1 = require("../../models");
const mainListings = (0, express_1.Router)();
const findDate = () => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear().toString();
    const date = mm + '/' + dd + '/' + yyyy;
    return date;
};
const categoryObject = {
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
};
mainListings.get("/create_listing", async (_, res) => {
    if (!login_1.authenticated.auth) {
        res.redirect("/login");
    }
    res.render("listings/new_listing", { authentication: login_1.authenticated.auth, username: login_1.authenticated.name });
});
mainListings.get("/active_listings", async (_, res) => {
    if (!login_1.authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const listings = await models_1.Listing.findAll({
            where: {
                finished: false
            }
        });
        res.render("listings/active_listings", {
            listings: listings,
            username: login_1.authenticated.name
        });
    }
});
mainListings.post("/create_listing", async (req, res) => {
    const newListing = await models_1.Listing.create({ title: req.body.listing, description: req.body.description, bid: req.body.bid, dateOfCreation: findDate(), dateOfFinishing: "false", creator: login_1.authenticated.name, link: req.body.image, category: Object.keys(categoryObject).find(key => categoryObject[key] === req.body.category), finished: false });
    const userLength = (await models_1.User.findAll()).length;
    const entries = [];
    for (let i = 1; i <= userLength; i++) {
        entries.push({
            userId: i,
            listingId: newListing.id,
            onWatchlist: false
        });
    }
    await models_1.Watchlist.bulkCreate(entries);
    res.redirect("/index");
});
mainListings.get("/listings/:listing", async (req, res) => {
    if (!login_1.authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const comments = await models_1.Comment.findAll({
            where: {
                listingId: parseInt(req.params.listing)
            }
        });
        const listing = await models_1.Listing.findAll({
            where: {
                id: parseInt(req.params.listing)
            }
        });
        const id = await models_1.User.findAll({
            where: {
                username: login_1.authenticated.name.toLowerCase()
            }
        });
        const onWatchlist = await models_1.Watchlist.findAll({
            where: {
                userid: id[0].id,
                listingid: parseInt(req.params.listing)
            }
        });
        res.render("listings/listing", { username: login_1.authenticated.name, info: listing[0], watchlist: (onWatchlist.length > 0 && !onWatchlist[0].onWatchlist) ? "Add to " : "Remove from", comments: comments });
    }
});
mainListings.post("/comment/:listing", async (req, res) => {
    const userId = (await models_1.User.findAll({
        where: {
            username: login_1.authenticated.name
        }
    }))[0].id;
    const newComment = await models_1.Comment.create({ userId: userId, listingId: parseInt(req.params.listing), textContent: req.body.textContent, dateOfCreation: findDate(), creator: login_1.authenticated.name });
    const userLength = (await models_1.User.findAll()).length;
    const entries = [];
    for (let i = 1; i <= userLength; i++) {
        entries.push({
            userId: i,
            commentId: newComment.id,
            liked: false
        });
    }
    await models_1.Like.bulkCreate(entries);
    res.redirect(`/listings/${req.params.listing}`);
});
mainListings.post("/comment2/:comment", async (req, res) => {
    const userId = (await models_1.User.findAll({
        where: {
            username: login_1.authenticated.name.toLowerCase()
        }
    }))[0].id;
    const likedStatus = (await models_1.Like.findAll({
        where: {
            userId: userId,
            commentId: parseInt(req.params.comment)
        }
    }))[0].liked;
    const numLikes = (await models_1.Comment.findAll({
        where: {
            id: parseInt(req.params.comment)
        }
    }))[0].likes;
    await models_1.Like.update({ liked: !likedStatus }, {
        where: {
            userId: userId,
            commentId: parseInt(req.params.comment)
        }
    });
    await models_1.Comment.update({ likes: likedStatus ? numLikes - 1 : numLikes + 1 }, {
        where: {
            id: parseInt(req.params.comment)
        }
    });
    const listingId = (await models_1.Comment.findAll({
        where: {
            id: parseInt(req.params.comment)
        }
    }))[0].listingId;
    res.redirect(`/listings/${listingId}`);
});
mainListings.post("/listings/:listing", async (req, res) => {
    if (!login_1.authenticated.auth) {
        res.redirect("/login");
    }
    else if (parseFloat(req.body.bid) > 1000000000) {
        res.redirect(`/listings/${req.params.listing}`);
    }
    else {
        await models_1.Listing.update({ bid: parseFloat(req.body.bid), winner: login_1.authenticated.name }, {
            where: {
                id: parseInt(req.params.listing)
            }
        });
        const comments = await models_1.Comment.findAll({
            where: {
                listingId: parseInt(req.params.listing)
            }
        });
        const listing = await models_1.Listing.findAll({
            where: {
                id: parseInt(req.params.listing)
            }
        });
        const id = await models_1.User.findAll({
            where: {
                username: login_1.authenticated.name.toLowerCase()
            }
        });
        const onWatchlist = await models_1.Watchlist.findAll({
            where: {
                userid: id[0].id,
                listingid: req.params.listing
            }
        });
        res.render("listings/listing", { username: login_1.authenticated.name, info: listing[0], watchlist: !onWatchlist[0].onWatchlist ? "Add to " : "Remove from", comments: comments });
    }
});
mainListings.get("/editlistings/:listing", async (req, res) => {
    const name = (await models_1.Listing.findAll({
        where: {
            id: parseInt(req.params.listing)
        }
    }))[0].creator;
    if (!login_1.authenticated.auth) {
        res.redirect("/login");
    }
    else if (login_1.authenticated.name != name) {
        res.redirect(`/listings/${parseInt(req.params.listing)}`);
    }
    else {
        const listingInfo = (await models_1.Listing.findAll({
            where: {
                id: parseInt(req.params.listing)
            }
        }))[0];
        console.log(listingInfo.category);
        res.render("listings/edit_listing", { username: login_1.authenticated.name, info: listingInfo, object: categoryObject });
    }
});
mainListings.post("/listings2/:listing", async (req, res) => {
    if (!login_1.authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const user = await models_1.User.findAll({
            where: {
                username: login_1.authenticated.name.toLowerCase()
            }
        });
        const watchlistStatus = (await models_1.Watchlist.findAll({
            where: {
                userId: user[0].id,
                listingId: parseInt(req.params.listing)
            }
        }))[0].onWatchlist;
        await models_1.Watchlist.update({ onWatchlist: !watchlistStatus }, {
            where: {
                userId: user[0].id,
                listingId: parseInt(req.params.listing)
            }
        });
        res.redirect(`/listings/${req.params.listing}`);
    }
});
exports.default = mainListings;
//# sourceMappingURL=main-listings.js.map