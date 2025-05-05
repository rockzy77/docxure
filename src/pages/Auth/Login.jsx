import { useContext, useState } from "react";
import CustomInput from "../../components/CustomInput";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { loginLedgerDB } from "../../services/authAPI";
import { useNavigate } from "react-router-dom";
import { getProcessByLIDDB } from "../../services/verifyAPI";
import { AppContext } from "../../provider/appProvider";

const Login = ({ userType, setAuthType, setUserType }) => {

    const [passHide, setPassHide] = useState(true);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const appData = useContext(AppContext);

    const nav = useNavigate();


    const isValidEmail = (email) => emailRegex.test(email);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginLedger = async () => {
        if (email === '' || password === '') {
            alert("Fill all the fields!");
            return;
        }

        var data = {
            LEMAIL: email,
            LPASSWORD: password
        };

        var res = await loginLedgerDB(data);
        if (res.success) {
            localStorage.setItem('token', res.token);
            appData.setUser(res.user);
            if (res.user.IS_ACTIVE) {

               
                if (res.user.LTYPE === 'issuer') {
                    nav('/dashboard/issuer');
                }
                else if (res.user.LTYPE === 'user') {
                    nav('/dashboard/user');
                }
                else if (res.user.LTYPE === 'admin') {
                    nav('/dashboard/admin');
                }
            }
            else {
                if (res.user.LTYPE === 'issuer') {
                    var res2 = await getProcessByLIDDB(res.user.LID);
                    if (res2.success) {
                        if (res2.process[0].STATUS === 'pending') {
                            setAuthType('uverify');
                        }
                        else if (res2.process[0].STATUS === 'not_initiated') {
                            alert('Your account is not yet verified. Please provide the following details to verify your account.');
                            setAuthType('verify');
                        }
                        else if (res2.process[0].STATUS === 'rejected') {
                            alert('Your account is rejected by the admin. Please submit fair proof or contact the admin.');
                            setAuthType('verify');
                        }
                    }
                    else {
                        alert(res2.message);
                    }
                }
                else{
                    alert("Your account is deactivated by the admin. Please contact the admin for more details.");
                    localStorage.removeItem('token');
                    appData.setUser(null);
                    nav('/');
                }
            }
        }
        else {
            alert(res.message)
        }
    }


    return <div className="loginSection">
        <h1>{userType.charAt(0).toUpperCase() + userType.slice(1)} Login</h1>
        <p>{userType === 'issuer' ? 'Login securely and issue certificates with confidence—zero tampering worries.' :
            'Login and access your certificates anytime, anywhere—secure and tamper-proof.'}
        </p>
        <br />

        <CustomInput onChange={setEmail} type={'text'} placeholder={'Email'} />

        <br />
        <CustomInput onChange={setPassword} type={passHide ? 'password' : 'text'} placeholder={'Password'}
            icon={password !== '' ? passHide ? <IoEyeOutline className="fieldIcon" onClick={() => {
                setPassHide(false)
            }} /> : <IoEyeOffOutline className="fieldIcon" onClick={() => {
                setPassHide(true)
            }} /> : ''}
        />
        <br />
        <button onClick={async () => {
            await loginLedger();
        }} className="submitBtn">LogIn</button>
        <br />
        <br />
        <p>Don't have an account? <span onClick={() => {
            setAuthType('register')
        }} className="rlink">Register</span></p>
        <span onClick={() => {
            setUserType('general');
            setAuthType('login');
        }} className="rlink">Change Account Type</span>
    </div>

}


export default Login;