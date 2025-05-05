import { useState } from "react";
import { FiUpload } from "react-icons/fi";


const CustomUpload = ({ title, setFile, }) => {

    const [fileName, setFileName] = useState(null);

    return <div onClick={() => {
        document.getElementById("proof").click();
    }} className="cupload">
        <h3>{title}</h3>
        <div style={{
            marginTop: 3,
            textAlign: 'center'
        }}>
            {
                fileName !== null ? <span>{fileName}</span>
                    : <FiUpload className="uploadicon" />
            }

        </div>



        <input accept="image/png, image/jpeg" onChange={(e) => {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name)
        }} type="file" name="proof" id="proof" />

    </div>
}

export default CustomUpload;