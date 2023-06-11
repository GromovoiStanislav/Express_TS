import express, {Request, Response} from "express";
import {DBType} from "../db/db";
import {HTTP_STATUSES} from "../utils";



export const getTestsRouter = (db: DBType) => {

    const router = express.Router()

    router.delete('/all', async (req: Request, res: Response) => {
        db.courses = []
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router

}