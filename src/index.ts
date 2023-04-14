import express, { Express, Request, Response } from "express";
import signup from "./routes/auth/signup";
import login from "./routes/auth/login";
import mainListings from "./routes/listings/main-listings";
import otherListings from "./routes/listings/other-listings";
import { authenticated } from "./routes/auth/login";


const app: Express = express();

app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(express.urlencoded());

app.use("/", signup);
app.use("/", login);
app.use("/", mainListings);
app.use("/", otherListings);

app.use((_: Request, res: Response) => {
    res.status(404);
    if (!authenticated.auth){
        res.render("404", {authenticated: false, username: ""});
    }
    else{
        res.render("404", {authenticated: true, username: authenticated.name});
    }
});

app.listen(4000);