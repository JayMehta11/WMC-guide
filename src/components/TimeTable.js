import React,{useState,useEffect,useContext} from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plu 
import timeGridPlugin from '@fullcalendar/timegrid' // a plu 
import PulseLoader from 'react-spinners/PulseLoader'
import { currentUser } from '../Services/AuthServices'
import { getEnrolledIn } from '../Services/CourseServices'
import { GlobalLoadingContext } from '../Context/GlobalLoadingContext'
import { toast } from 'react-toastify'

export default function TimeTable() {

    const [events,setEvents] = useState([]);
    const {setGlobalLoading} = useContext(GlobalLoadingContext)
    const [user,setUser] = useState(currentUser.value)
    const [loading,setLoading] = useState(false);

    const colors = [
        // "#004c6d","#346888","#5886a5","#7aa6c2","#9dc6e0","#c1e7ff"
        // "#8CE68C","#ABF1BC","#CFFFF6","#AEE7F8","#87CDF6"
        "#1fe074","#00c698","#00a9b5","008ac5","0069c0","0045a5","0b1d78"
    ]

    const SemesterDuration = {
        monsoon: {
            start: '08-01',
            end: '11-30'
        },
        winter: {
            start: '01-01',
            end: '04-30'
        },
        summer: {
            start: '05-01',
            end: '07-30'
        }
    }
    
    useEffect(() => {
        let AuthObservalble = currentUser.subscribe(data => setUser(data))
    
        return () => {
          AuthObservalble.unsubscribe();
        }
      },[])

      let FetchCourses = async () => {
        if(user!=="loading" && user!==null){

        
        setLoading(true);
        try{
            let CourseResponse = await getEnrolledIn();
            setLoading(false);
            if(CourseResponse.status){
                let temp = [];
                CourseResponse.enrollments.map((course,i) => {
                    course.course[0].schedule.map(courseDesc => {
                        temp.push({
                            title: course.course[0].courseCode,
                            startTime: `${courseDesc.time.split("-")[0]}`,
                            endTime: `${courseDesc.time.split("-")[1]}`,
                            daysOfWeek: [courseDesc.day+1],
                            color: colors[i%7],
                            startRecur: `${(course.year)}-${SemesterDuration[(course.semester).toLowerCase()].start}`,
                            endRecur: `${(course.year)}-${SemesterDuration[(course.semester).toLowerCase()].end}`
                        })
                    })
                })
                setEvents(temp);

            }else{
                
                // setcourses([])
                toast.error("Unable to get Courses") 
            }
        }catch(err){
            setLoading(false);
            toast.error("Unable to get Courses")
        }
        }
        
    } 
    useEffect(() => {
        FetchCourses();
    },[])

    return (
        <div className="px-2 mt-3">
            {loading ? <div className="w-100 mt-4 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> : 
            <FullCalendar
                plugins={[ timeGridPlugin ]}
                themeSystem= 'bootstrap'
                initialView="timeGridWeek"
                weekends={true}            
                events = {events}
            />
            }
        </div>
    )
}
