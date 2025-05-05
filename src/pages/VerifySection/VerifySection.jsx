import { useEffect, useState } from "react";
import CertificateCard from "../../components/CertificateCard";
import NavBar from "../../components/NavBar";
import CustomInput from "../../components/CustomInput";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { BiUpload } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { verifyDocumentDB } from "../../services/verifyAPI";

const VerifySection = () => {

    const [certId, setCertId] = useState('');

    const {certid} = useParams();

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [docResponse, setDocResponse] = useState(null);

    useEffect(() => {
        if(certid){
            setCertId(certid)
        }
    }, [certid]);

    return <section id="dashboard">
        <NavBar verify={true} />

        <div className="dashboard-cont">
            <div className="left">
                <div className="ver-cent">
                    <h1 style={{
                        fontSize: 30
                    }}>Verify Certificate</h1>
                    <br />
                    <CustomInput onChange={(a) => {
                        if (isNaN(a)) {
                            return
                        }
                        else {
                            setCertId(a)
                        }
                    }} type={'text'} disabled={
                        certid ? true : false
                    } value={certId} placeholder={'Certificate Id'} />
                    <br />

                    <div onClick={() => {
                        document.getElementById("certUpload").click()
                    }} style={{
                        cursor: 'pointer',
                        justifyContent: 'space-between'
                    }} className="cinput">

                        <span style={{
                            fontSize: 13.5,
                            color: 'grey',
                            position: 'relative',
                            top: 13
                        }}>{fileName ? fileName : 'Upload Certificate'}</span>

                        <input accept="application/pdf, image/jpeg, image/png" id="certUpload" style={{
                            display: 'none'
                        }} onChange={(e) => {
                            setFile(e.target.files[0]);
                            setFileName(e.target.files[0].name)
                        }} type='file' />

                        <BiUpload style={{
                            position: 'relative',
                            top: 14
                        }} />
                    </div>
                    <br />
                    <button onClick={async() => {
                        if (!certId) {
                            alert('Please enter certificate id')
                            return
                        }
                        if (!file) {
                            alert('Please upload certificate')
                            return
                        }
                        var res = await verifyDocumentDB(certId, file);
                        if (res.success) {
                            alert('Certificate verified successfully');
                            setDocResponse(res.document)
                        }
                        else {
                            alert(res.message);
                            setDocResponse(res.document);
                        }
        }} className="submitBtn">Verify</button>
                </div>
              
            </div>
        
            <div className={`right ${!docResponse ? 'fl-c js-c ai-c' : '' }`}>
               

                        {
                            docResponse ? <div className="selectedCertSection">
                            <h3 style={{
                                color: docResponse.IS_ACTIVE ? '' : '#8e2339',
                            }}>Document Id: {docResponse.DID} {
                                    docResponse.IS_ACTIVE ? '' : '(Revoked)'
                                }</h3>
                            <p>Document Name</p>
                            <span>{docResponse.DNAME}</span>

                            <p>Issuer Name</p>
                            <span>{docResponse.ISS_NAME}</span>

                            <p>Issuer Email</p>
                            <span>{docResponse.ISS_EMAIL}</span>

                            <p>Reciever Name</p>
                            <span>{docResponse.REC_NAME}</span>

                            <p>Reciever Email</p>
                            <span>{docResponse.REC_EMAIL}</span>

                            <p>Issued Date</p>
                            <span>{docResponse.createdAt}</span>

                            <p>Issued Document</p>
                            <span><a target="_blank" href={docResponse.DURL}>{docResponse.DURL}</a></span>
                        </div>  : <h3 style={{
                            fontWeight: 500
                        }}>Issue documents with zero tamper worry.</h3> 
                        }

                      
                
            </div>
        </div>
    </section>
}


export default VerifySection;