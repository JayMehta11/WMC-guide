import { AddToPhotosSharp, AssignmentOutlined, EventNoteOutlined, EventOutlined, ExitToAppOutlined, MenuBookOutlined } from '@material-ui/icons'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { HomeContext } from '../Context/HomeContext'
import { currentUser, Logout } from '../Services/AuthServices'
import './home.scss'

export default function SideNavBar(props) {
    const route = useLocation()
    const path = route.pathname.split('/')[1];
    const {navigator,setNavigator} = useContext(HomeContext)
    const [user,setUser] = useState(currentUser.value)
    
    useEffect(() => {
    let AuthObservalble = currentUser.subscribe(data => setUser(data))

    return () => {
      AuthObservalble.unsubscribe();
    }
  },[])
    let HandleNavigationChange = (idx) => {
        setNavigator(idx);
        if(props.mobileOpen){
            props.close();
        }
    }
    return (
        <div className="w-100 h-100 side-navbar">
            <img className="mt-3 mx-3" src="guide.png"></img>
            <div className="d-flex flex-column mt-5">
                {user.isAdmin ? <>
                    <div onClick={() => HandleNavigationChange(0)} className={"w-100 d-flex px-4 py-3 side-nav-item" + (navigator===0 ? " active" : "")} > 
                        <AssignmentOutlined />
                        Todos
                    </div>
                    
                    <div onClick={() => {HandleNavigationChange(1)}} className={"w-100 d-flex px-4 py-3 side-nav-item" + (navigator===1 ? " active" : "")} >
                        <MenuBookOutlined />
                        Course
                    </div>
                    <div onClick={() => {HandleNavigationChange(2)}} className={"w-100 d-flex px-4 py-3 side-nav-item" + (navigator===2 ? " active" : "")} >
                        <AddToPhotosSharp />
                        Stuent Enrollment
                    </div>
                
                </> : <>
                
                    <div onClick={() => {HandleNavigationChange(0)}} className={"w-100 d-flex px-4 py-3 side-nav-item" + (navigator===0 ? " active" : "")} > 
                        <AssignmentOutlined />
                        Todos
                    </div>
                    
                    <div onClick={() => {HandleNavigationChange(1)}} className={"w-100 d-flex px-4 py-3 side-nav-item" + (navigator===1 ? " active" : "")} >
                        <EventNoteOutlined />
                        My Courses
                    </div>

                    <div onClick={() => {HandleNavigationChange(2)}} className={"w-100 d-flex px-4 py-3 side-nav-item" + (navigator===2 ? " active" : "")} >
                        <EventOutlined />
                        Time Table
                    </div>

                    <div onClick={() => {HandleNavigationChange(3)}} className={"w-100 d-flex px-4 py-3 side-nav-item" + (navigator===3 ? " active" : "")} >
                        <MenuBookOutlined />
                        Courses
                    </div>
                
                </>}

                <div onClick={() => Logout()} className={"w-100 d-flex px-4 py-3 side-nav-item"} >
                        <ExitToAppOutlined />
                        Logout
                </div>
            </div>
        </div>
    )
}
