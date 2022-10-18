import express, { Request, Response,NextFunction} from 'express'
import { RequestWithQuery,RequestWithParams,RequestWithBody,RequestWithParamsAndBody } from './types';
import {CreateCourseModel} from './models/CreateCourseModel'
import {UpdateCourseModel} from './models/UpdateCourseModel'
import {QueryCourseModel} from './models/QueryCourseModel'
import {CourseViewModel} from './models/CourseViewModel'
import {URIParamsCourseIdModel} from './models/URIParamsCourseIdModel'

export const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());

export const HTTP_STATUSES={
    OK_200:200,
    CREATED_201:201,
    NO_CONTENT_204:204,
    BAD_REQUEST_400:400,
    NOT_FOUND_404:404,
}



type CourseType = {
    id:number
    title:string
    studentsCount:number
}

const db:{courses:CourseType[]} = {
    courses:[
        {id:1,title:"front-end",studentsCount:10},
        {id:1,title:"front-end",studentsCount:10},
        {id:1,title:"front-end",studentsCount:10},
        {id:1,title:"front-end",studentsCount:10},
    ]
}

const getCourseViewModel = (dbCourse:CourseType):CourseViewModel=>({
    id: dbCourse.id,
    title: dbCourse.title
})

app.get('/courses', async (req: RequestWithQuery<QueryCourseModel>, res: Response<CourseViewModel[]>) => {
    let foundCourses = db.courses
   
    if(req.query.title){
        foundCourses=foundCourses.filter(c=>c.title.indexOf(req.query.title)>1)
    }

    res.json(foundCourses.map(getCourseViewModel))

})
app.get('/courses/:id', async (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
    
    const foundCourse = db.courses.find(c=>c.id === +req.params.id)
    
    if(!foundCourse){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.json(getCourseViewModel(foundCourse))
   
})
app.post('/courses', async (req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {
    if(!req.body.title){
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
app.delete('/courses/:id', async (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {
    
    const foundCourse = db.courses.filter(c=>c.id !== +req.params.id)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
   
})
app.put('/courses/:id', async (req: RequestWithParamsAndBody<URIParamsCourseIdModel,UpdateCourseModel>, res: Response) => {
    if(!req.body.title){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
    
    const foundCourse = db.courses.find(c=>c.id === +req.params.id)
    
    if(!foundCourse){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
   
    foundCourse.title = req.body.title

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete('/all', async (req: Request, res: Response) => {
    db.courses=[]
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.use((req:Request, res:Response,next:NextFunction) => {
    res.sendStatus(404)
})
app.use((err:any,req:Request, res:Response,next:NextFunction) => {
    res.sendStatus(500)
})


app.listen(PORT, () => {
        console.log(`Example app listening on port http://localhost:${PORT}/`)
 })
