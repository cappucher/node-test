import { Router, Request, Response } from "express";
import { User } from "../../models";
import { Sequelize } from "sequelize";

const login: Router = Router();

interface authentication {
    auth: boolean;
    name: String;
}

const sequelize = new Sequelize("cappumercedb", "root", "tinwet-sabmob-9hAbsu", {
    host: "localhost",
    dialect: "mysql",
});

const authenticated: authentication = {
    auth: false,
    name: "",
};

const hashCode = (str: String): number => {
    let hash: number = 0;
    for (let i: number = 0, len = str.length; i < len; i++) {
        let chr: number = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
};

login.get("/login", (_: Request, res: Response): void => {
    if (authenticated.auth) {
        res.redirect("/index");
    }
    res.render("auth/login");
});

login.get("/logout", (_: Request, res: Response): void => {
    if (authenticated.auth) {
        authenticated.auth = false;
        authenticated.name = "";
        res.redirect("/index");
    } else {
        res.redirect("/login");
    }
});

login.get("/index", (_: Request, res: Response): void => {
    res.render("index", {
        authenticated: authenticated.auth,
        username: authenticated.name
    });
});

login.post("/login", async (req: Request, res: Response) => {
    await sequelize.sync({ force: true });
    const users = await User.findAll({
        where: {
            username: req.body.username.toLowerCase(),
            password: hashCode(req.body.password),
        },
    });
    if (users.length == 0) {
        res.render("auth/login", { rejected: true });
    } else {
        authenticated.auth = true;
        authenticated.name = req.body.username;
        res.redirect("index");
    }
});

export default login;
export { authenticated };