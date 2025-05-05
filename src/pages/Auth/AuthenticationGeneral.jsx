import { useContext, useEffect, useState } from "react";
import Login from "./Login";
import Registration from "./Register";
import IssuerVerification from "./IssuerVerification";
import UnderVerification from "./UnderVerification";
import { useNavigate } from "react-router-dom";
import { getUserByTokenDB } from "../../services/authAPI";
import { AppContext } from "../../provider/appProvider";
import { getProcessByLIDDB } from "../../services/verifyAPI";


const AuthenticationGeneral = () => {

    const [userType, setUserType] = useState('general');

    const [authData, setAuthData] = useState({});

    const appData = useContext(AppContext);

    const [forceUpdate, setForceUpdate] = useState(false);

    const [authType, setAuthType] = useState('login');

    const [loading, setLoading] = useState(true);


    const nav = useNavigate();

    const getUser = async () => {
        var token = localStorage.getItem('token');
        if (token) {
            var res = await getUserByTokenDB(token);
            if (res.success) {
                appData.setUser(res.user);
                console.log(res.user);
                if (res.user.LTYPE === 'issuer') {
                    if (res.user.IS_ACTIVE) {
                        nav('/dashboard/issuer');
                    }
                    else {
                        var res2 = await getProcessByLIDDB(res.user.LID);
                        if (res2.success) {
                            if (res2.process[0].STATUS === 'pending') {
                                setUserType('issuer')
                                setAuthType('uverify');
                            }
                            else if (res2.process[0].STATUS === 'not_initiated') {
                                setUserType('issuer');
                                setAuthType('verify');
                            }
                            else if (res2.process[0].STATUS === 'rejected') {
                                alert('Your account is rejected by the admin. Please submit fair proof or contact the admin.');
                                setUserType('issuer');
                                setAuthType('verify');
                            }

                        }
                        else {
                            alert(res2.message);
                        }
                    }
                }
                else {
                    nav('/dashboard/user');
                }
            }
        }

        setLoading(false)

        setForceUpdate((prev) => !prev);
    };


    return <section onLoad={getUser} id="userType">

        <div className="left">
            <img src={process.env.PUBLIC_URL + "logo.png"} alt="" />
            <br />
            <h2>"Securing Authenticity, <br />
                Empowering Trust."</h2>
            <p>Decentralized, secure document verification for trust and authenticity.</p>
        </div>

        <div className="right">
            {
                !loading ? userType === 'general' ? <>
                    <h2>Access DocXure As</h2>
                    <br />
                    <div className="row">
                        <button onClick={() => {
                            setUserType("issuer")
                        }} className="userTypeButton">Issuer</button>
                        <button onClick={() => {
                            setUserType("user")
                        }} className="userTypeButton">User</button>
                    </div>
                    <br />
                    <h2>or</h2>
                    <br />
                    <button onClick={() => { nav('/verify') }} className="userTypeButton">Verify Document</button></>
                    : authType === 'login' ? <Login userType={userType} setAuthType={setAuthType} setUserType={setUserType} /> : authType === 'register' ? <Registration setAuthData={setAuthData} userType={userType} setAuthType={setAuthType} setUserType={setUserType} />
                        : authType === 'verify' ? <IssuerVerification authData={authData} setAuthType={setAuthType} setUserType={setUserType} /> : authType === 'uverify' ? <UnderVerification setAuthType={setAuthType} setUserType={setUserType} /> : ''

                    : <></>
            }
        </div>
    </section>
}

export default AuthenticationGeneral;