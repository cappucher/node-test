"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const login_1 = require("../auth/login");
const express_1 = require("express");
const sequelize_1 = require("sequelize");
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
const otherListings = (0, express_1.Router)();
otherListings.get("/category_listings", async (_, res) => {
    if (!login_1.authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const listings = await models_1.Listing.findAll({
            where: {
                finished: false,
                category: "None"
            }
        });
        res.render("listings/category_listings", { listings: listings, username: login_1.authenticated.auth, object: categoryObject, value: "" });
    }
});
otherListings.get("/category_listings/:category", async (req, res) => {
    if (!login_1.authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const listings = await models_1.Listing.findAll({
            where: {
                finished: false,
                category: categoryObject[req.params.category]
            }
        });
        if (listings.length == 0) {
            res.render("listings/category_listings", { listings: [], username: login_1.authenticated.name, object: categoryObject, value: req.params.category });
        }
        else {
            res.render("listings/category_listings", { listings: listings, username: login_1.authenticated.name, object: categoryObject, value: req.params.category });
        }
    }
});
otherListings.get("/watchlist", async (_, res) => {
    if (!login_1.authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const users = await models_1.User.findAll({
            where: {
                username: login_1.authenticated.name.toLowerCase()
            }
        });
        const watchlist = await models_1.Watchlist.findAll({
            where: {
                userId: users[0].id,
                onWatchlist: true
            }
        });
        const entries = [];
        for (let i = 0; i < watchlist.length; i++) {
            entries.push(watchlist[i].listingId);
        }
        if (entries.length == 0) {
            res.render("listings/watchlist", { listings: [], username: login_1.authenticated.name });
        }
        else {
            const listings = await models_1.Listing.findAll({
                where: {
                    id: {
                        [sequelize_1.Op.or]: entries
                    }
                }
            });
            res.render("listings/watchlist", { listings: listings, username: login_1.authenticated.name });
        }
    }
});
exports.default = otherListings;
//# sourceMappingURL=other-listings.js.map