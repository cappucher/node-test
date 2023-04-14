import express, { Request, Response } from "express";

const app = express();

app.get("/", (_: Request, res: Response) => {
    res.send("hello, world");
})

app.listen(3003);