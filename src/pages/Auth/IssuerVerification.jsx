import { useContext, useState } from "react";
import CustomUpload from "../../components/CustomUpload";
import { createProcessDB } from "../../services/verifyAPI";
import { AppContext } from "../../provider/appProvider";
import { MdLogout } from "react-icons/md";

const IssuerVerification = ({ setAuthType, authData }) => {

    const [proof, setProof] = useState(null);

    const appData = useContext(AppContext);

    const verifyIssuer = async () => {


        var LID = null;
        if(appData.user){
            LID = appData.user.LID;
        } 
        else{
            LID = authData.LID;
        }

        if (!proof) {
            alert("Upload a proof of issuer!");
            return;
        }



        var res = await createProcessDB({
            image: proof,
            lid: LID,
            status: 'pending'
        });

        if(res.success){
            setAuthType('uverify');
        }
        else{
            alert(res.message);
        }
    }

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
        <h1>Issuer Verification</h1>
        <p style={{
            marginTop: 10
        }}>The issuer must be an authorized representative of the organization or institution responsible for issuing the document. This can include roles such as administrators, managers, or other officials with the authority to verify and issue certificates. Verification requires a valid ID and a recent selfie to confirm the issuer’s identity and role.</p>
        <br />
        <CustomUpload title={'Proof of Issuer'} setFile={setProof} />

        <br />

        <button onClick={async () => {
            await verifyIssuer()
        }} className="submitBtn">Verify</button>
    </div>
}

export default IssuerVerification;