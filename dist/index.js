"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("./routes/auth/signup"));
const login_1 = __importDefault(require("./routes/auth/login"));
const main_listings_1 = __importDefault(require("./routes/listings/main-listings"));
const other_listings_1 = __importDefault(require("./routes/listings/other-listings"));
const login_2 = require("./routes/auth/login");
const app = (0, express_1.default)();
app.use(express_1.default.static('public'));
app.set("view engine", "ejs");
app.use(express_1.default.urlencoded());
app.use("/", signup_1.default);
app.use("/", login_1.default);
app.use("/", main_listings_1.default);
app.use("/", other_listings_1.default);
app.use((_, res) => {
    res.status(404);
    if (!login_2.authenticated.auth) {
        res.render("404", { authenticated: false, username: "" });
    }
    else {
        res.render("404", { authenticated: true, username: login_2.authenticated.name });
    }
});
app.listen(4000);
//# sourceMappingURL=index.js.map