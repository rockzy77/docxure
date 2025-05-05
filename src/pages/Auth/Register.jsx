import { useState } from "react";
import CustomInput from "../../components/CustomInput";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { registerLedgerDB } from "../../services/authAPI";
import { createProcessDB } from "../../services/verifyAPI";

const Registration = ({ userType, setAuthType, setUserType, setAuthData }) => {

    const [passHide, setPassHide] = useState(true);
    const [cpassHide, setCPassHide] = useState(true);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const nav = useNavigate();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    const isValidEmail = (email) => emailRegex.test(email);

    const registerLedger = async () => {

        if (email === '' || name === '' || password === '' || cpassword === '') {
            alert("Fill all the fields!");
            return;
        }
        if (userType === 'issuer') {
            if (phone === '' || address === '') {
                alert("Fill all the fields!");
                return;
            }
        }

        if (!isValidEmail(email)) {
            alert("Enter a valid email!")
            return;
        }

        if (password.length < 8) {
            alert("Password must be atleast 8 character long!")
            return;
        }

        if (password !== cpassword) {
            alert("Passwords does not match!")
            return;
        }

        var data = {
            LNAME: name,
            LEMAIL: email,
            LPHONE: phone,
            LADDRESS: address,
            LPASSWORD: password,
            LTYPE: userType,
        };

        if (userType === 'user') {
            data['IS_ACTIVE'] = true;
        }
        else {
            data['IS_ACTIVE'] = false;
        }


        var response = await registerLedgerDB(data);

        if (response.success) {
            localStorage.setItem('token', response.token);
            if (userType === 'user') {
                alert("Successfully Registered.");
                
                window.location.reload();
            }
            else {
                var res2 = await createProcessDB({
                    lid: response.user.LID,
                    status: 'not_initiated',
                });
                if (res2.success) {
                    alert("Successfully Registered. Please wait for the verification process to complete.");
                    setAuthData(response.user);
                    setAuthType('verify')
                }

            }
        }
        else {
            alert(response.message)
        }
    }






    return <div className="loginSection">
        <h1>{userType.charAt(0).toUpperCase() + userType.slice(1)} Registration</h1>
        <p>{userType === 'issuer' ? 'Register securely and issue certificates with confidence—zero tampering worries.' :
            'Register and access your certificates anytime, anywhere—secure and tamper-proof.'}
        </p>
        <br />

        {
            userType === 'issuer' ? <>
                {/* Issuer Registration */}
                <CustomInput onChange={setName} type={'text'} placeholder={'Organization Name'} />

                <br />
                <CustomInput onChange={setAddress} type={'text'} placeholder={'Organization Address'} />

                <br />
                <CustomInput onChange={setEmail} type={'text'} placeholder={'Email'} />

                <br />
                <CustomInput onChange={setPhone} type={'text'} placeholder={'Phone Number'} />

                <br />
                <CustomInput onChange={setPassword} type={passHide ? 'password' : 'text'} placeholder={'Password'}
                    icon={password !== '' ? passHide ? <IoEyeOutline className="fieldIcon" onClick={() => {
                        setPassHide(false)
                    }} /> : <IoEyeOffOutline className="fieldIcon" onClick={() => {
                        setPassHide(true)
                    }} /> : ''}
                />
                <br />
                <CustomInput onChange={setCPassword} type={cpassHide ? 'password' : 'text'} placeholder={'Confirm Password'}
                    icon={cpassword !== '' ? cpassHide ? <IoEyeOutline className="fieldIcon" onClick={() => {
                        setCPassHide(false)
                    }} /> : <IoEyeOffOutline className="fieldIcon" onClick={() => {
                        setCPassHide(true)
                    }} /> : ''}
                /></> : <>

                {/* User Registration */}
                <CustomInput onChange={setName} type={'text'} placeholder={'Full Name'} />


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
                <CustomInput onChange={setCPassword} type={cpassHide ? 'password' : 'text'} placeholder={'Confirm Password'}
                    icon={cpassword !== '' ? cpassHide ? <IoEyeOutline className="fieldIcon" onClick={() => {
                        setCPassHide(false)
                    }} /> : <IoEyeOffOutline className="fieldIcon" onClick={() => {
                        setCPassHide(true)
                    }} /> : ''}
                /></>
        }
        <br />
        <button onClick={async () => {
            await registerLedger();
        }} className="submitBtn">Register</button>
        <br />
        <br />
        <p>Already have an account? <span onClick={() => {
            setAuthType('login')
        }} className="rlink">Login</span></p>
        <span onClick={() => {
            setUserType('general');
            setAuthType('login');
        }} className="rlink">Change Account Type</span>
    </div>

}


export default Registration;