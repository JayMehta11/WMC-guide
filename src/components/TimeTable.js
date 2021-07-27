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
                CourseResponse.enrollments.map(course => {
                    course.course[0].schedule.map(courseDesc => {
                        temp.push({
                            title: course.course[0].courseCode,
                            startTime: courseDesc.time.split("-")[0],
                            endTime: courseDesc.time.split("-")[1],
                            daysOfWeek: [courseDesc.day]
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
            {events.length===0 ? <div className="w-100 mt-4 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> : 
            <FullCalendar
            plugins={[ timeGridPlugin ]}
            initialView="timeGridWeek"
            weekends={true}            
            events = {events}

            />
            }
        </div>
    )
}
