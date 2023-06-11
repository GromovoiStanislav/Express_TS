export type CourseType = {
    id: number
    title: string
    studentsCount: number
}

export const db: DBType = {
    courses: [
        {id: 1, title: "front-end", studentsCount: 10},
        {id: 1, title: "front-end", studentsCount: 10},
        {id: 1, title: "front-end", studentsCount: 10},
        {id: 1, title: "front-end", studentsCount: 10},
    ]
}

export type DBType = { courses: CourseType[] }