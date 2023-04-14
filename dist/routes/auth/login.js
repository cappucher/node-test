"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticated = void 0;
const express_1 = require("express");
const models_1 = require("../../models");
const sequelize_1 = require("sequelize");
const login = (0, express_1.Router)();
const sequelize = new sequelize_1.Sequelize("cappumercedb", "root", "tinwet-sabmob-9hAbsu", {
    host: "localhost",
    dialect: "mysql",
});
const authenticated = {
    auth: false,
    name: "",
};
exports.authenticated = authenticated;
const hashCode = (str) => {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
};
login.get("/login", (_, res) => {
    if (authenticated.auth) {
        res.redirect("/index");
    }
    res.render("auth/login");
});
login.get("/logout", (_, res) => {
    if (authenticated.auth) {
        authenticated.auth = false;
        authenticated.name = "";
        res.redirect("/index");
    }
    else {
        res.redirect("/login");
    }
});
login.get("/index", (_, res) => {
    res.render("index", {
        authenticated: authenticated.auth,
        username: authenticated.name
    });
});
login.post("/login", async (req, res) => {
    await sequelize.sync({ force: true });
    const users = await models_1.User.findAll({
        where: {
            username: req.body.username.toLowerCase(),
            password: hashCode(req.body.password),
        },
    });
    if (users.length == 0) {
        res.render("auth/login", { rejected: true });
    }
    else {
        authenticated.auth = true;
        authenticated.name = req.body.username;
        res.redirect("index");
    }
});
exports.default = login;
//# sourceMappingURL=login.js.map