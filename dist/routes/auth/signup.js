"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../../models");
const login_1 = require("./login");
const signup = (0, express_1.Router)();
const hashCode = (str) => {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
};
signup.get("/signup", (_, res) => {
    if (login_1.authenticated.auth) {
        res.redirect("/index");
    }
    else {
        res.render("auth/signup");
    }
});
signup.post("/signup", async (req, res) => {
    if (req.body.password != req.body.confirmPassword) {
        console.log(await models_1.User.findAll());
        res.render("auth/signup", { different: true });
    }
    else {
        const users = await models_1.User.findAll({
            where: {
                username: req.body.username.toLowerCase()
            }
        });
        if (users.length != 0) {
            res.render("auth/signup", { exists: true });
        }
        else {
            login_1.authenticated.auth = true;
            login_1.authenticated.name = req.body.username;
            const newUser = await models_1.User.create({ username: req.body.username.toLowerCase(), password: hashCode(req.body.password) });
            const listingLength = (await models_1.Listing.findAll()).length;
            const commentLength = (await models_1.Comment.findAll()).length;
            const watchlistEntries = [];
            const likeEntries = [];
            for (let i = 1; i <= listingLength; i++) {
                watchlistEntries.push({
                    userId: newUser.id,
                    listingId: i,
                    onWatchlist: false
                });
            }
            for (let i = 1; i <= commentLength; i++) {
                likeEntries.push({
                    userId: newUser.id,
                    commentId: i,
                    liked: false
                });
            }
            await models_1.Watchlist.bulkCreate(watchlistEntries);
            await models_1.Like.bulkCreate(likeEntries);
            res.redirect("/index");
        }
    }
});
exports.default = signup;
//# sourceMappingURL=signup.js.map