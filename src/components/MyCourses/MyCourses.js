import { Button, IconButton, TextField } from '@material-ui/core'
import { Add, CheckCircle, ExpandLessOutlined, FirstPageOutlined, LastPageOutlined, LocalConvenienceStoreOutlined, NavigateBeforeOutlined, NavigateNextOutlined, RemoveOutlined, SentimentDissatisfiedOutlined } from '@material-ui/icons'

import * as moment from 'moment'
import React, { useContext, useEffect, useRef, useState } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'

import { toast } from 'react-toastify'
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext'
import { PieChart } from 'react-minimal-pie-chart';

import { currentUser } from '../../Services/AuthServices'
import { addRating, getEnrolledIn } from '../../Services/CourseServices'
import Rating from '../Rating'
import './myCourse.scss'

export default function MyCourses() {

    const [courses,setcourses] = useState("loading");
    const [loading,setLoading] = useState(false);
    
    
    const [courseDescriptionOpen,setCourseDescriptionOpen] = useState(-1);
    const [courseRatingOpen,setCourseRatingOpen] = useState(-1);
    
    const {setGlobalLoading} = useContext(GlobalLoadingContext)
    
    const [creditsDistribution,setCreditsDistribution] = useState(false);
    const [creditsDistributionData,setCreditsDistributionData] = useState([]);
    
    
    const [user,setUser] = useState(currentUser.value)
    const [page,setPage] = useState(0);
    const [credits,setCredits] = useState(0)
    const [semester,setSemester] = useState("");
    const [year,setYear] = useState(parseInt(moment().format('YYYY')))
    useEffect(() => {
        let AuthObservalble = currentUser.subscribe(data => setUser(data))
    
        return () => {
          AuthObservalble.unsubscribe();
        }
      },[])

    let Days = [
        "Mon","Tue","Wed","Thu","Fri","Sat","Sun"
    ]

    
    
    const colors = [
        // "#004c6d","#346888","#5886a5","#7aa6c2","#9dc6e0","#c1e7ff"
        // "#8CE68C","#ABF1BC","#CFFFF6","#AEE7F8","#87CDF6"
        "#1fe074","#00c698","#00a9b5","#008ac5","#0069c0","#0045a5","#0b1d78"
    ]
    
    
    
    
    
    
    

    let getTableScaling = () => {
        let course = document.querySelectorAll(".course-details");
        let coursesContainer = document.querySelector(".course-container");
        let mainContainer = document.querySelector("#main-container")
        let header = document.querySelector(".header")
        if(course !== undefined && coursesContainer!==undefined && course.length > 0){
            if(mainContainer.offsetWidth < course[0].offsetWidth){
                
                for(let i=0;i<course.length;i++){
                    course[i].style.transform = `scaleX(${(mainContainer.offsetWidth / course[i].offsetWidth) - 0.003})`
                    course[i].style.transformOrigin = "center 0%";
                    
                    
                }
            }
            else{
                for(let i=0;i<course.length;i++){
                    course[i].style.transform = `scale(1)`
                    course[i].style.transformOrigin = "0% 0%"
                    coursesContainer.style.rowGap = "0rem 0.8rem"
                }
            }
            
        }
        
    }
    let FetchCourses = async () => {
        if(user!=="loading" && user!==null){

        
        setLoading(true);
        try{
            let CourseResponse = await getEnrolledIn(semester,year);
            setLoading(false);
            if(CourseResponse.status){
                let temp = 0;
                CourseResponse.enrollments.map(c => {
                    temp += parseInt(c.course[0].credits)
                })
                setCredits(temp)
                setcourses(CourseResponse.enrollments);
                let tp = new Map();
                CourseResponse.enrollments.map(course => {
                    course.course[0].categoryIds.map(c => {
                        let x = tp.get(c);
                        if(x){
                            tp.set(c,parseInt(parseInt(x) + parseInt(course.course[0].credits)));
                        }else{
                            tp.set(c,parseInt(course.course[0].credits));
                        }
                    })
                })
                let y = [];
                let count=0;
                for (let [key, value] of tp) {
                    y.push({
                        title: `${key}`,
                        value: parseInt(value),
                        color: colors[count]
                    })
                    count++;
                }
                
                setCreditsDistribution(tp)
                setCreditsDistributionData(y);

            }else{
                
                setcourses([])
                toast.error("Unable to get Courses") 
            }
        }catch(err){
            setLoading(false);
            toast.error("Unable to get Courses")
        }
        }
        
    }
    let getRating = (course) => {
        let rate = 0;
        course.ratings.map((r,i) => {
            rate += r.rating;
        })
        rate = parseInt(rate / course.ratings.length)
        if(rate===0){
            rate=1;
        }
        return rate;
    }
     
    useEffect(() => {
        FetchCourses();
    },[semester,year])

    useEffect(() => {
        getTableScaling();

        window.addEventListener('resize',getTableScaling)

        return () => {
            window.removeEventListener('resize',getTableScaling)
        }
    },[courses])

    
    return (
        <>
        {courses==="loading" || loading ? <div className="w-100 mt-4 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> :
            <>
            <div className="w-100 mt-4 px-lg-5 px-md-4 px-1 d-flex flex-wrap justify-content-lg-between justify-content-md-between justify-content-evenly align-items-end">
                <Button className="credits-button" variant="contained" startIcon={<CheckCircle style={{color: "rgb(99, 231, 134)"}} />} disabled>
                    credits: {credits}
                </Button>
                <div className="d-flex flex-wrap align-items-start mt-2">
                    <TextField
                        label="Semester"
                        select
                        focused
                        value={semester}
                        className="me-2 mb-2"
                        onChange={(e) => setSemester(e.target.value)}
                        SelectProps={{
                            native: true
                        }}
                    >
                        <option value="">All</option>
                        <option value="Monsoon">Monsoon</option>
                        <option value="Winter">Winter</option>
                        <option value="Summer">Summer</option>
                    </TextField>
                    <TextField
                        label="Year"
                        select
                        focused
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        SelectProps={{
                            native: true
                        }}
                    >
                        <option value="">All</option>
                        <option value={parseInt(moment().format('YYYY')) - 3}>{parseInt(moment().format('YYYY')) - 3}</option>
                        <option value={parseInt(moment().format('YYYY')) - 2}>{parseInt(moment().format('YYYY')) - 2}</option>
                        <option value={parseInt(moment().format('YYYY')) - 1}>{parseInt(moment().format('YYYY')) - 1}</option>
                        <option value={parseInt(moment().format('YYYY'))}>{parseInt(moment().format('YYYY'))}</option>
                        <option value={parseInt(moment().format('YYYY')) + 1}>{parseInt(moment().format('YYYY')) + 1}</option>
                        <option value={parseInt(moment().format('YYYY')) + 2}>{parseInt(moment().format('YYYY')) + 2}</option>
                        <option value={parseInt(moment().format('YYYY')) + 3}>{parseInt(moment().format('YYYY')) + 3}</option>
                    </TextField>
                </div>
                
            </div>
             
           {/* {creditsDistribution!==false && <div className="mx-auto my-3 d-flex justify-content-center align-items-center" style={{color: "white",maxWidth: "200px",maxHeight: "200px"}}>
                <span><PieChart 
                    data = {creditsDistributionData}
                      label={(props) => { return props.dataEntry.title;}}
                      labelStyle={{
                        fontSize: '8px',
                        fontWeight: "bold"
                      }}  
                      animate={true}
                /></span>
            </div>} */}

            {(creditsDistribution!==false && creditsDistributionData.length!==0) && <div className="mx-lg-5 mx-md-4 mx-2 mt-5 pt-2 shadow chart-container">
                <h3 className="text-center">Credits Distribution</h3>
                <div className="d-flex mt-3 justify-content-center align-items-center flex-lg-row flex-md-column-reverse flex-column-reverse">
                    <div className="col-6 my-3 d-flex justify-content-center align-items-center">
                        <span className="d-flex w-50 flex-column">
                            {creditsDistributionData.map(c => 
                                <span key={c.title} className="d-flex justify-content-between align-items-center">
                                    <p className="d-flex flex-column">{c.title}<span style={{backgroundColor: c.color}}></span></p>
                                    {c.value}
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="col-6 my-3 d-flex justify-content-center align-items-center mx-auto" >
                    <span style={{maxWidth: '200px',maxHeight: "200px"}}>
                        <PieChart 
                            data = {creditsDistributionData}  
                            animate={true}
                        />
                    </span>
                </div>
            </div>
                
                
            </div>}
            {courses.length===0 ? <h4 className={`text-center mt-5 no-data-found`}>No Data Found <SentimentDissatisfiedOutlined /></h4> :
            <div className="w-100 my-4 d-flex flex-column justify-content-between align-items-center course-container px-lg-5 px-md-4 px-1 mx-auto">
                <div className="w-100 d-flex  align-items-center py-0 header">
                    {/* <span><Fab className={"col-1 fab-button " + (course.done ? "completed" :"not_completed")} ><AssignmentTurnedInOutlined className={(course.done ? "completed" :"not_completed")} /></Fab></span> */}
                    <span className="col-1 text-center">{"#"}</span>
                    <span className="col-2 text-center">{"Code"}</span>
                    <span className="col-3 text-center">{"Name"}</span>
                    <span className="col-2 text-center">{"Credits"}</span>
                    <span className="col-2 text-center" >{"Semester"}</span>
                    <span className="col-1 text-center" >{"Year"}</span>
                    <span className="col-1 text-center"></span>
                </div>
               {courses.slice((10*page),Math.min(10*(page+1),courses.length)).map((course,i) => 
                        <span key={course._id} className="w-100 course-details">
                            <div className="w-100 d-flex  align-items-center course py-0">
                                <span className="col-1 text-center">{i+1}</span>
                                <span className="col-2 text-center">{course.course[0].courseCode}</span>
                                <span className="col-3 text-center">{course.course[0].courseName}</span>
                                <span className="col-2 text-center completed" style={{backgroundColor:"white"}}><li>{course.course[0].credits}</li></span>
                                <span className="col-2 text-center" >{course.semester}</span>
                                <span className="col-1 text-center" >{course.year}</span>
                                <span className="col-1 text-center">{courseDescriptionOpen!==i ? <NavigateNextOutlined onClick={()=> setCourseDescriptionOpen(i)} style={{color: "lightgrey",cursor: 'pointer'}} /> : <ExpandLessOutlined onClick={()=> setCourseDescriptionOpen(-1)} style={{color: "lightgrey",cursor: 'pointer'}} />}</span>
                            </div>
                            {courseDescriptionOpen===i && <div className="w-100 mt-4 ps-3 mb-3 course-description">

                                <h5>Description:</h5>
                                <p className="px-3">{course.course[0].courseDescription}</p>
                                <h5 className="mt-2">Prerequisites:</h5>
                                <p className="px-3">{course.course[0].prerequisites.map((pre,i) => 
                                    `${pre}${i!==(course.course[0].prerequisites.length - 1) ? ",": ""}`
                                )}</p>
                                <h5>Faculty:</h5>
                                <p className="px-3">{course.course[0].faculty}</p>
                                <h5 className="mt-2">Category:</h5>
                                <p className="px-3">{course.course[0].categoryIds.map((pre,i) => 
                                    `${pre}${i!==course.course[0].categoryIds.length-1 ? ",": ""}`
                                )}</p>
                                <h5 className="mt-2">Schedule:</h5>
                                <p className="px-3 d-flex flex-column">{course.course[0].schedule.map((pre,i) => 
                                    <p>{`${Days[pre.day]}  ${pre.time}`}</p>
                                )}</p>
                                <h5 className="mt-2">Ratings:</h5>

                                {course.course[0].ratings.length!==0 &&
                                <>
                                <h4 className="ps-3 d-flex align-items-center"><span className="me-2">{getRating(course.course[0])}.0</span> <Rating readonly={true} value={getRating(course.course[0])} /></h4>
                                
                                {courseRatingOpen!==i ? <Button color="primary" onClick={() => setCourseRatingOpen(i)} startIcon={<Add />}>Show Reviews</Button> : <Button color="primary" onClick={() => setCourseRatingOpen(-1)} startIcon={<RemoveOutlined />}>Hide Reviews</Button>}
                                </>}

                                {courseRatingOpen===i && <div className="mt-3 d-flex flex-column rating-container">
                                    {course.course[0].ratings.map((rate,k) => 
                                        <span key={k} className="ms-3 d-flex flex-column"><Rating readonly={true} value={rate.rating} /> {rate.comment}</span>
                                    )}
                                        
                                </div>}
                                    

                            </div>}
                       
                        </span>
                    
                    )}

                <div className="w-100 d-flex justify-content-end align-items-center py-0 me-2">
                    <IconButton size="small" disabled={page===0} onClick={() => setPage(0)}><FirstPageOutlined /></IconButton>
                    <IconButton size="small" disabled={page===0} onClick={() => setPage(prev => prev - 1)}><NavigateBeforeOutlined /></IconButton>
                    <IconButton size="small" disabled={page===(Math.ceil((courses.length)/10) - 1)} onClick={() => setPage(prev => prev + 1)}><NavigateNextOutlined /></IconButton>
                    <IconButton className="me-2" size="small" disabled={page===(Math.ceil((courses.length)/10) - 1)} onClick={() => setPage((Math.ceil((courses.length)/10) - 1))}><LastPageOutlined /></IconButton>
                    {`${page+1} of ${Math.ceil((courses.length)/10)} page`}
                </div>
            </div>
            }</>
            }
            {/* <Operation open={openOperationDialog} FetchCourses={FetchCourses} updateCourse={UpdateCourseItem} course={courseUpdateDetails} close={CloseDialog} /> */}
            {/* <ConfirmDialog open={ConfirmDeleteDialog.open} item={"Course"} close={CloseConfirmDeleteDialog} action={() => DeleteCourse(ConfirmDeleteDialog.idx)} /> */}
        </>
    )
}
