import { useContext, useState } from "react"
import { AppContext } from "../provider/appProvider"
import { IoPerson } from "react-icons/io5";
import { updateUSerDB } from "../services/authAPI";

export const ProfileCard = ({ closePOP }) => {

    const appData = useContext(AppContext);

    const [lname, setLname] = useState(appData.user.LNAME);
    const [lemail, setLemail] = useState(appData.user.LEMAIL);
    const [lphone, setLphone] = useState(appData.user.LPHONE);
    const [laddress, setLaddress] = useState(appData.user.LADDRESS);

    const updateProfile = async () => {

        var res;

        if (appData.user.LTYPE === "issuer") {
            res = await updateUSerDB(appData.user.LID,{
                LNAME: lname,
                LEMAIL: lemail,
                LPHONE: lphone,
                LADDRESS: laddress,
            });
        } else {
            res = await updateUSerDB(appData.user.LID, {
                LNAME: lname,
                LEMAIL: lemail,
                LPHONE: lphone,
            });
        }

        if (res.success) {
            alert("Profile Updated");
            appData.setUser(res.user);
        }
        else {
            alert(res.message);
        }
    }

    return <div style={{
        position: 'relative',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        color: '#000',
        width: '50%',
    }} className="profile-card">
        <div style={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <div style={{
                height: 100,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'grey',
            }} className="profile-card-header">
                {
                    appData.user.LPROFILE_PIC ? <img style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }} src={appData.user.LPROFILE_PIC} alt="" /> : <IoPerson style={{
                        fontSize: 50,
                        color: '#fff'
                    }} />

                }
            </div>
        </div>
        <br />
        <div className="profile-card-body">
            {/* Name */}
            <div style={{
                display: 'flex',
                marginBottom: 10,
            }}>
                <label htmlFor="">Name: </label>
                <div style={{
                    width: 10
                }}></div>
                <input onChange={(e) => {
                    setLname(e.target.value);
                }} style={{
                    width: '100%',
                    outline: 'none',
                    border: 'none',
                    borderBottom: '1px solid #000',
                    marginBottom: 10,
                }} type="text" value={
                    lname
                } />
            </div>
            {/* Enamil */}
            <div style={{
                display: 'flex',
                marginBottom: 10,
            }}>
                <label htmlFor="">Email: </label>
                <div style={{
                    width: 10
                }}></div>
                <input onChange={(e) => {
                    setLemail(e.target.value);
                }} style={{
                    width: '100%',
                    outline: 'none',
                    border: 'none',
                    borderBottom: '1px solid #000',
                    marginBottom: 10,
                }} type="text" value={
                    lemail
                } />
            </div>

            {/* Phone */}
           <div style={{
                    display: 'flex',
                    marginBottom: 10,
                }}>
                    <label htmlFor="">Phone: </label>
                    <div style={{
                        width: 10
                    }}></div>
                    <input onChange={(e) => {
                        setLphone(e.target.value);
                    }} style={{
                        width: '100%',
                        outline: 'none',
                        border: 'none',
                        borderBottom: '1px solid #000',
                        marginBottom: 10,
                    }} type="text" value={
                        lphone
                    } />
                </div>


            {/* Address */}
            {
                appData.user.LTYPE === "issuer" ? <div style={{
                    display: 'flex',
                    marginBottom: 10,
                }}>
                    <label htmlFor="">Address: </label>
                    <div style={{
                        width: 10
                    }}></div>
                    <input onChange={(e) => {
                        setLaddress(e.target.value);
                    }} style={{
                        width: '100%',
                        outline: 'none',
                        border: 'none',
                        borderBottom: '1px solid #000',
                        marginBottom: 10,
                    }} type="text" value={
                        laddress
                    } />
                </div> : ''
            }
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
        }}>
            <button onClick={()=>{
                updateProfile();
            }} style={{
                padding: '10px 26px',
                outline: 'none',
                border: 'none',
                backgroundColor: '#2d9b74',
                borderRadius: 5,
                color: '#fff',
                cursor: 'pointer'
            }}>Update</button>
            <button onClick={closePOP} style={{
                padding: '10px 26px',
                outline: 'none',
                border: 'none',
                backgroundColor: '#a0070a',
                borderRadius: 5,
                color: '#fff',
                cursor: 'pointer'
            }}>Cancel</button>
        </div>
    </div>
}