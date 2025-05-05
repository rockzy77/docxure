
import axios from 'axios';

axios.defaults.withCredentials = true;

const config = {headers: { 
    "Content-Type": "application/json"
}};


const imageConfig = {headers: {'Content-Type': 'multipart/form-data'}};

const urlHead = 'http://localhost:3001/api/v2';


export const getProcessByLIDDB = async(lid)=>{
    const url = urlHead + '/getProcessByLID/' + lid;
    try{
        const response = await axios.get(url);
        const body = await response.data;
        return body;
    } catch(e){
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
};


export const getAllProcessDB = async()=>{
    const url = urlHead + '/getAllProcess';
    try{
        const response = await axios.get(url);
        const body = await response.data;
        return body;
    } catch(e){
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
};


export const createProcessDB = async(data)=>{
    const url = urlHead + '/createProcess';
    try{
        const formData = new FormData();
        if(data.image){
            formData.append("image", data.image);
        }
        formData.append("LID", data.lid);
        formData.append("STATUS", data.status); 
        const response = await axios.post(url, formData, imageConfig);
        const body = await response.data;
        return body;
    } catch(e){
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
}

export const updateProcessDB = async(lpid, data)=>{
    const url = urlHead + '/updateProcess/'+lpid;
    try{
        const formData = new FormData();
        Object.keys(data).map((key)=>{
            formData.append(key, data[key]);
        });
        const response = await axios.put(url, formData, config);
        const body = await response.data;
        return body;
    } catch(e){
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
}


export const verifyDocumentDB = async(certid, fileData)=>{
    const url = urlHead + '/verify-document';
    try{
        const formData = new FormData();
        formData.append("DID", certid);
        formData.append("image", fileData);
        const response = await axios.post(url, formData, imageConfig);
        const body = await response.data;
        return body;
    } catch(e){
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
}


export const getAllActionLogDB = async()=>{
    const url = urlHead + '/getAllActionLogs';
    try{
        const response = await axios.get(url);
        const body = await response.data;
        return body;
    } catch(e){
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
}