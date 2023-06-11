import express, {NextFunction, Request, Response} from "express";
import {getCoursesRouter} from "./routes/courses";
import {getTestsRouter} from "./routes/tests";
import {db} from "./db/db";
import {HTTP_STATUSES} from "./utils";


export const app = express()
app.use(express.json());


app.use('/courses', getCoursesRouter(db))
app.use('/test', getTestsRouter(db))


app.use((req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
})