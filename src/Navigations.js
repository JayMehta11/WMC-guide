import Todo from "./components/Todos/Todo"
import Courses from "./components/Courses/Courses"
import StudentEnroll from "./components/StudentEnroll/StudentEnroll"
import MyCourses from "./components/MyCourses/MyCourses"
import TimeTable from "./components/TimeTable"

export const NavigationAdmin = [
    "Todos",
    "Courses",
    "Students"
]

export const Navigations = [
    "Todos",
    "My Courses",
    "Time Table",
    "Course"
]

export const NavigationComponent = [
    <Todo />,
    <MyCourses />,
    <TimeTable />,
    <Courses />
]

export const NavigationComponentAdmin = [
    <Todo />,
    <Courses />,
    <StudentEnroll />
]
