import { IoMdShare } from "react-icons/io";
import { MdOutlineFileDownload, MdRestore } from "react-icons/md";
import { RiProhibitedLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { restoreDocumentDB, revokeDocumentDB } from "../services/issuerAPI";
import { useContext } from "react";
import { AppContext } from "../provider/appProvider";


const CertificateCard = ({ cert, onClick, type }) => {

    const appData = useContext(AppContext);

    return <div style={{
        marginBottom: '10px'
    }} onClick={() => {
        onClick(cert);
        console.log(cert);
    }} className="certcard">
        <div className="cardl">
            <h4  style={{
                color: !cert.IS_ACTIVE ? '#8e2339' : ''
            }}>
                Cert Id: {cert.cert_id + (cert.IS_ACTIVE ? '' : ' (Revoked)')}
            </h4>
            <h4 style={{
                color: !cert.IS_ACTIVE ? '#8e2339' : ''
            }}>
                Cert Name: {cert.cert_name}
            </h4>
            {
                type === 'issuer' ? <h4 style={{
                    color: !cert.IS_ACTIVE ? '#8e2339' : ''
                }}>
                    Issued To: {cert.reciever_name}
                </h4> : <h4 style={{
                    color: !cert.IS_ACTIVE ? '#8e2339' : ''
                }}>
                    Issued By: {cert.issuer_name.slice(0, 18) + (cert.issuer_name.length > 18 ? '...' : '')}
                </h4>
            }

        </div>

        <div className="cardr">
            <FaEye
                onClick={async () => {
                    var url = cert.cert_url;
                    window.open(url, "_blank");
                }}
                title="Preview"
                className="cert-icons"
            />


            <IoMdShare title="Share" onClick={() => {
                var url = "http://localhost:3000/verify/" + cert.cert_id;
                navigator.clipboard.writeText(url);
                alert("Url copied to clipboard");
            }} className="cert-icons" />
            {
                type === 'issuer' && cert.IS_ACTIVE ? <RiProhibitedLine onClick={async () => {
                    var res = await revokeDocumentDB(cert.cert_id);
                    if (res.success) {
                        alert("Certificate Revoked");
                        window.location.reload();
                    }
                    else {
                        alert(res.message);
                    }
                }} title="Revoke" style={{
                    color: '#8e2339'
                }} className="cert-icons" /> : ''
            }
            {
                type === 'issuer' && !cert.IS_ACTIVE ? <MdRestore onClick={async () => {
                    var res = await restoreDocumentDB(cert.cert_id);
                    if (res.success) {
                        alert("Certificate Restored");
                        window.location.reload();

                    }
                    else {
                        alert(res.message);
                    }
                }} title="Revoke" style={{
                    color: 'green'
                }} className="cert-icons" /> : ''
            }
        </div>
    </div>
}

export default CertificateCard;