import { useContext, useEffect, useReducer, useState } from "react";
import CertificateCard from "../../components/CertificateCard";
import NavBar from "../../components/NavBar";
import CustomInput from "../../components/CustomInput";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosCloseCircle, IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../provider/appProvider";
import { getUserByTokenDB } from "../../services/authAPI";
import { getProcessByLIDDB } from "../../services/verifyAPI";
import { getDocumentsByREMDB } from "../../services/issuerAPI";


const UserDashboard = () => {

    const [selectedCert, setSelectedCert] = useState(null);

    const [loading, setLoading] = useState(true);

    const nav = useNavigate();

    const [showNotification, setShowNotification] = useState(false);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const appData = useContext(AppContext);

    const getUser = async () => {
        var token = localStorage.getItem('token');
        if (token) {
            var res = await getUserByTokenDB(token);
            if (res.success) {
                if(res.user.LTYPE === 'issuer'){
                    nav('/dashboard/issuer');
                }
                else if(res.user.LTYPE === 'admin'){
                    nav('/dashboard/admin');
                }
                appData.setUser(res.user);
                if (!res.user.IS_ACTIVE) {
                    alert("Your account is deactivated by the admin. Please contact the admin for more details.");
                    nav('/');
                    localStorage.removeItem('token');
                    appData.setUser(null);
                }
            }
            else {
                nav('/');
                localStorage.removeItem('token');
                appData.setUser(null);
            }
        }



        setLoading(false)
    };

    const getAllIssuedDocuments = async () => {
        if (appData.user) {
            // console.log(appData.user.LID);
            var res = await getDocumentsByREMDB(appData.user.LEMAIL);
            console.log(res)
            if (res.success) {
                var ldocs = res.documents.filter((item) => item.IS_ACTIVE === true);
                appData.setDocuments(ldocs);
                console.log(ldocs);
                appData.setBackupDocuments(ldocs);
            }
            else {
                alert(res.message);
            }
            forceUpdate();
        }
    }



    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {
        console.log("hai");
        getAllIssuedDocuments();
    }, [appData.user])


    return <section id="dashboard">
        <NavBar />



        <div className="dashboard-cont">
            <div className="left">
                <div className="row js-sb">
                    <h3>Issued Documents</h3>
                    <div style={{
                        display: 'flex',
                        gap: 10,
                        marginRight: 5
                    }}>

                       
                    </div>

                </div>

                <br />
                <CustomInput onChange={(value) => {
                    if (value === "") {
                        appData.setDocuments(appData.backupDocuments);
                        return;
                    }
                    var docs = appData.backupDocuments.filter((doc) => {
                        return doc.DNAME.toLowerCase().includes(value.toLowerCase());
                    }
                    );
                    appData.setDocuments(docs);
                }} type={'text'} placeholder={'Search for document by name'}
                />
                <br />


                {
                    appData.documents.length > 0 ? appData.documents.map((cert, index) => {
                        return <CertificateCard key={index} type='user' onClick={() => {
                            console.log(cert);
                            setSelectedCert(cert);
                            setShowNotification(false);
                        }}
                            cert={{
                                cert_id: cert.DID,
                                cert_name: cert.DNAME,
                                issuer_name: cert.ISS_NAME,
                                issuer_email: cert.ISS_EMAIL,
                                reciever_name: cert.REC_NAME,
                                reciever_email: cert.REC_EMAIL,
                                issued_date: cert.ISS_DATE,
                                cert_url: cert.DURL,
                                IS_ACTIVE: cert.IS_ACTIVE,
                            }} />
                    }
                    ) : <h3 style={{
                        textAlign: 'center',
                        fontWeight: 500,
                        position: 'relative',
                        top: '30%',
                    }}>No document issued yet.</h3>
                }


            </div>

            <div className={`right ${!selectedCert ? !showNotification ? 'fl-c js-c ai-c' : '' : ''}`}>
                {
                    selectedCert ?

                        <div className="selectedCertSection">
                            <h3>Document Id: {selectedCert.DID}</h3>
                            <p>Document Name</p>
                            <span>{selectedCert.DNAME}</span>

                            <p>Issuer Name</p>
                            <span>{selectedCert.ISS_NAME}</span>

                            <p>Issuer Email</p>
                            <span>{selectedCert.ISS_EMAIL}</span>

                            <p>Reciever Name</p>
                            <span>{selectedCert.REC_NAME}</span>

                            <p>Reciever Email</p>
                            <span>{selectedCert.REC_EMAIL}</span>

                            <p>Issued Date</p>
                            <span>{selectedCert.createdAt}</span>

                            <p>Issued Document</p>
                            <span><a target="_blank" href={selectedCert.DURL}>{selectedCert.DURL}</a></span>
                        </div>

                        : <h3 style={{
                            fontWeight: 500
                        }}>Access documents with zero tamper worry.</h3>
                }
            </div>
        </div>
    </section>
}


export default UserDashboard;