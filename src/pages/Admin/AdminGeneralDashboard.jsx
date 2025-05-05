import { useContext, useEffect, useState } from "react";
import { getUserByTokenDB } from "../../services/authAPI";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../provider/appProvider";
import { AdminDashboard } from "./AdminDashboard";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

export const AdminGeneralDashboard = () => {

    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    const [pageType, setPageType] = useState('admin');
    const appData = useContext(AppContext);

    const getUser = async () => {
        setLoading(true);
        var token = localStorage.getItem('token');
        if (token) {
            var res = await getUserByTokenDB(token);
            if (res.success) {
                if (res.user.LTYPE === 'user') {
                    nav('/dashboard/user');
                }
                else if (res.user.LTYPE === 'issuer') {
                    nav('/dashboard/issuer');
                }
                appData.setUser(res.user);
            }
            else {
                nav('/');
                localStorage.removeItem('token');
                appData.setUser(null);
            }
        }
        else {
            nav('/');
            appData.setUser(null);
        }



        setLoading(false)
    };


    useEffect(() => {
        getUser();
    }, [])


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            {/* left */}
            <div style={{
                width: '300px',
                backgroundColor: '#2d9b74',
                height: '100%',
                position: 'fixed',
                left: 0
            }} className="left">
                <h1 style={{
                    color: 'white',
                    padding: 20,
                    fontSize: 25
                }}>DOXURE</h1>
                <hr />

                <button onClick={()=>{
                    setPageType('admin')
                }} className="admin-btn" style={{
                    border: 'none',
                    borderBottom: '1px solid white',
                    width: '100%',
                    padding: 10,
                    color: '#fff',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                }}>Admin Panel</button><br />
               <button onClick={()=>{
                    setPageType('analytics')
                }} className="admin-btn" style={{
                    border: 'none',
                    borderBottom: '1px solid white',
                    width: '100%',
                    padding: 10,
                    color: '#fff',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                }}>Analytics</button><br />
                <button onClick={()=>{
                    appData.setUser(null);
                    localStorage.removeItem('token');
                    nav('/');
                }} className="admin-btn-l" style={{
                    border: 'none',
                    borderBottom: '1px solid white',
                    width: '100%',
                    padding: 10,
                    color: '#fff',
                    cursor: 'pointer',
                    backgroundColor: '#a0070a',
                }}>LogOut</button><br />
            </div>


            {/* right */}
            <div style={{
                width: 'calc(100% - 300px)',
                height: '100%',
                right: 0,
                position: 'absolute',
            }} className="right">
                {
                    pageType === 'admin' ? <AdminDashboard /> : <AnalyticsDashboard />
                }
            </div>
        </div>
    );
}
