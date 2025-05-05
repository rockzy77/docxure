import { useContext, useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import { AppContext } from "../provider/appProvider";
import { IoPerson } from "react-icons/io5";
import { createActionLogDB } from "../services/userAPI";
import { ProfileCard } from "./ProfileCard";
import { updateUSerDB } from "../services/authAPI";
import { useNavigate } from "react-router-dom";

const NavBar = ({ verify }) => {

    const appData = useContext(AppContext);

    const nav = useNavigate();

    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        console.log(appData.user);
    });

    const closePOP = () => {
        setShowProfile(false);
    }

    const [hidePopUp, setHidePopUp] = useState(true);

    return <div id="navbar">
        <h1 onClick={()=>{
            nav('/');
        }} style={{
            cursor: 'pointer'
        }}>DXure</h1>

        {showProfile ? <div style={{
            position: 'absolute',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            top: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
            <ProfileCard closePOP={closePOP} />
        </div> : ''}

        <div className="nav-cont">
            <span onClick={()=>{
                nav('/contact-us');
            }} style={{
                cursor: 'pointer'
            }}>Contact Us</span>
            {
                verify ? '' : <div onClick={() => {
                    setHidePopUp((prev) => !prev);
                }} className="profile-banner">
                    <IoPerson style={{
                        fontSize: 20,
                        color: '#fff'
                    }} />
                    {
                        !hidePopUp ? <div className="popup">
                            <p>{appData.user.LNAME.slice(0, 18) + (appData.user.LNAME.length > 18 ? '...' : '')
                            }</p>
                            <hr />
                            <p onClick={() => {
                                setShowProfile(true);
                            }}>Update Profile</p>
                            <hr />
                           
                            <p onClick={() => {
                                const lid = appData.user.LID;
                                if (lid) {
                                    createActionLogDB({
                                        TYPE: 'auth',
                                        ACTION: 'logout',
                                        ACTION_BY: lid
                                    })
                                }
                                localStorage.removeItem("token");
                                appData.setUser(null);
                                window.location.replace("/");
                            }}>LogOut</p>
                        </div> : ''
                    }
                </div>
            }

        </div>
    </div>
}

export default NavBar;