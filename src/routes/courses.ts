import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryCourseModel} from "../models/QueryCourseModel";
import express, {Response} from "express";
import {CourseViewModel} from "../models/CourseViewModel";
import {URIParamsCourseIdModel} from "../models/URIParamsCourseIdModel";
import {CreateCourseModel} from "../models/CreateCourseModel";
import {UpdateCourseModel} from "../models/UpdateCourseModel";
import {CourseType, DBType} from "../db/db";
import {HTTP_STATUSES} from "../utils";


export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => ({
    id: dbCourse.id,
    title: dbCourse.title
})




export const getCoursesRouter = (db:DBType) => {

    const router = express.Router()

    router.get('/', async (req: RequestWithQuery<QueryCourseModel>, res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses

        if (req.query.title) {
            foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > 1)
        }

        res.json(foundCourses.map(getCourseViewModel))

    })

    router.get('/:id', async (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {

        const foundCourse = db.courses.find(c => c.id === +req.params.id)

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(getCourseViewModel(foundCourse))

    })

    router.post('/', async (req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        const createdCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0,
        }
        db.courses.push(createdCourse)

        res.status(HTTP_STATUSES.CREATED_201).json(getCourseViewModel(createdCourse))
    })

    router.delete('/:id', async (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {

        const foundCourse = db.courses.filter(c => c.id !== +req.params.id)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    })

    router.put('/:id', async (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>, res: Response) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        const foundCourse = db.courses.find(c => c.id === +req.params.id)

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        foundCourse.title = req.body.title

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router
}