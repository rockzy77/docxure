import { useContext } from "react";
import { AppContext } from "../../provider/appProvider";
import { MdLogout } from "react-icons/md";

const UnderVerification = ({setUserType, setAuthType}) => {

    const appData = useContext(AppContext);

    return <div className="loginSection">
         <span onClick={()=>{
                    appData.setUser(null);
                    localStorage.removeItem("token");
                    window.location.reload();
                }} style={{
                    position: 'absolute',
                    top: 10,
                    fontSize: 20,
                    cursor: 'pointer',
                    right: 13
                }}><MdLogout /></span>
    <h1>Verification Under Process!</h1>
    <p style={{
        marginTop: 10
    }}>Your issuer registration is currently under review. Once your details and documents are verified, you will be notified via email. After successful verification, you will be able to log in and gain the authority to issue certificates through the system. Please allow some time for this process to complete, and rest assured that you’ll receive an update as soon as the verification is done.</p>
<br />
</div>
}

export default UnderVerification;