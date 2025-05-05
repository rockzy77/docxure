import { useContext, useEffect, useReducer, useState } from "react";
import CertificateCard from "../../components/CertificateCard";
import NavBar from "../../components/NavBar";
import CustomInput from "../../components/CustomInput";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../provider/appProvider";
import { getUserByTokenDB, updateUSerDB } from "../../services/authAPI";
import crypto from "isomorphic-webcrypto";
import { createDocumentDB, getDocumentsByLIDDB } from "../../services/issuerAPI";
import { IoMdAdd, IoIosNotifications } from "react-icons/io";
import { render } from "@testing-library/react";


const IssuerDashBoard = () => {

    const generateKeyPair = async () => {
        try {
            const keyPair = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["encrypt", "decrypt"]
            );

            // Export keys as PEM format
            const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
            const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

            // Convert to Base64 for easy storage
            const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
            const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

            console.log("Public Key:", publicKeyBase64);
            console.log("Private Key:", privateKeyBase64);

            return { publicKey: publicKeyBase64, privateKey: privateKeyBase64 };
        } catch (error) {
            console.error("Error generating key pair:", error);
        }
    };

    const [selectedCert, setSelectedCert] = useState(null);

    const [addCert, setAddCert] = useState(false);

    const [showKeyPopup, setShowKeyPopup] = useState(false);

    const [showNotification, setShowNotification] = useState(false);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);


    const [keys, setKeys] = useState(null);


    const [loading, setLoading] = useState(true);

    const nav = useNavigate();

    const appData = useContext(AppContext);

    const getUser = async () => {
        var token = localStorage.getItem('token');
        if (token) {
            var res = await getUserByTokenDB(token);
            if (res.success) {
                if(res.user.LTYPE === 'user'){
                    nav('/dashboard/user');
                }
                else if(res.user.LTYPE === 'admin'){
                    nav('/dashboard/admin');
                }
                appData.setUser(res.user);
                if (res.user.FIRST_LOGIN) {
                    var keys = await generateKeyPair();
                    console.log(keys);
                    setShowKeyPopup(true);
                    setKeys(keys);
                }
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
            var res = await getDocumentsByLIDDB(appData.user.LID);
            console.log(res)
            if (res.success) {
                appData.setDocuments(res.documents);
                console.log(res.documents);
                appData.setBackupDocuments(res.documents);
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

        {
            showKeyPopup ? <div style={{
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
                <div style={{
                    padding: '50px',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    display: 'flex',
                    backgroundColor: '#fff',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} className="keyDownloadPopup">
                    <h3>Download your private key</h3>
                    <p>Download your private key and keep it safe. This key is required to issue certificates. Once the key is lost it cannot be retrieved.</p>
                    <div className="downloadCont">
                        <br />
                        <a style={{
                            outline: 'none',
                            border: 'none',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#212121'
                        }} href={"data:application/octet-stream," + keys.privateKey} download={appData.user.LNAME+'_doxure_pk.txt'}>Download Private Key</a>
                    </div>
                    <br />
                    <div style={{
                        display: 'flex',
                    }}>

                        <button onClick={async () => {
                            var res2 = await updateUSerDB(appData.user.LID, {
                                FIRST_LOGIN: false,
                                LPUBLIC_KEY: keys.publicKey,
                            });
                            if (!res2.success) {
                                alert("Something went wrong while saving keys. Please try again later.");
                            }
                            else {
                                setShowKeyPopup(false);
                            }
                        }} style={{
                            padding: '10px',
                            outline: 'none',
                            backgroundColor: '#25bc85',
                            border: 'none',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#fff'
                        }}>I HAVE DOWNLOADED AND THE KEY IS SAFE WITH ME</button>
                    </div>
                </div>
            </div> : ''
        }

        <div className="dashboard-cont">
            <div className="left">
                <div className="row js-sb">
                    <h3>Issued Documents</h3>
                    <div style={{
                        display: 'flex',
                        gap: 10,
                        marginRight: 5
                    }}>
                        <p style={{
                            fontSize: 25,
                        }} onClick={() => {
                            setAddCert(true);
                            setShowNotification(false);
                        }} className="newcertlink"><IoMdAdd /></p>
                    </div>
                </div>

                <br />
                <CustomInput onChange={(value) => {
                    if (value === "") {
                        appData.setDocuments(appData.backupDocuments);
                        return;
                    }
                    var docs = appData.backupDocuments.filter((doc) => {
                        return doc.REC_NAME.toLowerCase().includes(value.toLowerCase());
                    }
                    );
                    appData.setDocuments(docs);
                }} type={'text'} placeholder={'Search by Issued Name'}
                />
                <br />

                {
                    appData.documents.length > 0 ? appData.documents.map((cert, index) => {
                        return <CertificateCard key={index} type='issuer' onClick={() => {
                            console.log(cert);
                            setSelectedCert(cert);
                            setAddCert(false);
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
                  !addCert ? selectedCert ?

                        <div className="selectedCertSection">
                            <h3 style={{
                                color: selectedCert.IS_ACTIVE ? '' : '#8e2339',
                            }}>Document Id: {selectedCert.DID} {
                                    selectedCert.IS_ACTIVE ? '' : '(Revoked)'
                                }</h3>
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
                        }}>Issue documents with zero tamper worry.</h3> : <AddNewCertificate setAddCert={setAddCert} /> 
                }
            </div>
        </div>
    </section>
}


const AddNewCertificate = ({ setAddCert }) => {

    const [selectedPrivateKey, setSelectedPrivateKey] = useState(null);

    const [fetchedPrivateKey, setFetchedPrivateKey] = useState(null);

    const [documentHash, setDocumentHash] = useState(null);

    const [selectedDocument, setSelectedDocument] = useState(null);

    const [documentName, setDocumentName] = useState('');

    const [recieverName, setRecieverName] = useState('');

    const [recieverEmail, setRecieverEmail] = useState('');

    const [loading, setLoading] = useState(false);

    const appData = useContext(AppContext);

    const issueDocument = async () => {
        if (!selectedPrivateKey) {
            alert("Please upload your private key.");
            return;
        }
        if (!selectedDocument) {
            alert("Please upload the document.");
            return;
        }
        if (!recieverName) {
            alert("Please enter the reciever name.");
            return;
        }
        if (!recieverEmail) {
            alert("Please enter the reciever email.");
            return;
        }
        if (!documentHash) {
            alert("Something went wrong while hashing the document. Please try again later.");
            return;
        }

        setLoading(true);

        var res = await createDocumentDB(selectedDocument, {
            LID: appData.user.LID,
            DNAME: documentName,
            REC_NAME: recieverName,
            REC_EMAIL: recieverEmail,
            DHASH: documentHash.hash,
            DSIGN: documentHash.signature,
            ISS_NAME: appData.user.LNAME,
            ISS_EMAIL: appData.user.LEMAIL,
        });


        if (res.success) {
            alert("Document issued successfully.");
            appData.setDocuments([...appData.documents, res.document]);
        }
        else {
            alert(res.message);
        }

        setLoading(false);

    }


    return <div className="newCertSection">
        <div className="row js-sb ai-c">
            <h3>Issue New Document</h3>
            <IoIosCloseCircle onClick={() => {
                setAddCert(false);
            }} style={{
                color: '#8c1d18',
                fontSize: 25,
                cursor: 'pointer'
            }} />
        </div>
        <br />
        <input onChange={
            (e) => {
                setDocumentName(e.target.value);
            }
        } type="text" defaultValue={documentName} placeholder="Document Name (Optional)" />
        <br />
        <br />
        <input onChange={
            (e) => {
                setRecieverName(e.target.value);
            }
        } type="text" placeholder="Reciever Name" />
        <br />
        <br />
        <input onChange={
            (e) => {
                setRecieverEmail(e.target.value);
            }
        } type="text" placeholder="Reciever Email" />
        <br />
        <br />
        <div className="uploadCont" onClick={() => {
            document.getElementById("pkfile").click()
        }} >
            <span style={{
                color: !selectedPrivateKey ? '#757575' : '#000'
            }}>{!selectedPrivateKey ? 'Upload Private Key' : selectedPrivateKey.name}</span>
        </div>
        <br />
        <div className="uploadCont" onClick={() => {
            document.getElementById("certfile").click()
        }} >
            <span style={{
                color: !selectedDocument ? '#757575' : '#000'
            }}>{!selectedDocument ? 'Upload Document' : selectedDocument.name}</span>
        </div>
        <br />
        <button onClick={async () => {
            await issueDocument();
        }} className="submitBtn">Issue Document</button>

        <input onChange={
            (e) => {
                if (!e.target.files[0]) {
                    return;
                }
                setSelectedPrivateKey(e.target.files[0]);
                var reader = new FileReader();
                reader.onload = async function () {
                    var key = reader.result.trim();
                    setFetchedPrivateKey(key);
                };
                reader.readAsText(e.target.files[0]);
            }
        } accept=".txt" style={{
            display: 'none'
        }} type="file" name="pkfile" id="pkfile" />
        <input
    onChange={(e) => {
        if (!selectedPrivateKey) {
            alert("Please upload your private key first.");
            return;
        }
    
        setSelectedDocument(e.target.files[0]);
        var name = e.target.files[0].name;
        name = name.split('.');
        name.pop();
        name = name.join('.');
        setDocumentName(name);
    
        var reader = new FileReader();
    
        reader.onload = async function (e) {
            const fileContent = new Uint8Array(e.target.result);
            
            try {
                // 🔹 Hash the file content
                const hashBuffer = await crypto.subtle.digest("SHA-256", fileContent);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const fileHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
            
                // 🔹 Convert PEM private key to binary
                function pemToBinary(pem) {
                    const b64Lines = pem.replace(/-----.*?-----/g, "").replace(/\s+/g, "");
                    const binaryDer = atob(b64Lines);
                    return Uint8Array.from(binaryDer, c => c.charCodeAt(0));
                }
                
                const privateKeyBinary = pemToBinary(fetchedPrivateKey);
            
                // 🔹 Import Private Key
                const privateKeyObj = await crypto.subtle.importKey(
                    "pkcs8",
                    privateKeyBinary,
                    { name: "RSA-PSS", hash: "SHA-256" },
                    false,
                    ["sign"]
                );
            
                // function hexToUint8Array(hexString) {
                //     return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                // }
                // const hashBuffer = hexToUint8Array(fileHash);
            
                // 🔹 Sign the hash
                const signature = await crypto.subtle.sign(
                    { name: "RSA-PSS", saltLength: 32 },
                    privateKeyObj,
                    hashBuffer
                );
            
                // 🔹 Convert signature to base64
                const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
            
                setDocumentHash({
                    hash: fileHash,
                    signature: signatureBase64,
                });
            
            } catch (error) {
                console.error("Signing error:", error);
                alert("Failed to sign document.");
            }
        };
    
        reader.readAsArrayBuffer(e.target.files[0]);
    }}
    accept="application/pdf, image/jpeg, image/png"
    style={{ display: "none" }}
    type="file"
    name="certfile"
    id="certfile"
/>
    </div>
}




export default IssuerDashBoard;