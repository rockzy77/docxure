
import axios from 'axios';

axios.defaults.withCredentials = true;

const config = {
    headers: {
        "Content-Type": "application/json"
    }
};


const imageConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

const urlHead = 'http://localhost:3001/api/v2';

export const getDocumentsByLIDDB = async (lid) => {
    const url = urlHead + '/getDocumentsByLID/'+lid;
    try {
        const response = await axios.get(url);
        const body = await response.data;
        return body;
    } catch (e) {
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
};

export const getAllDocumentsDB = async () => {
    const url = urlHead + '/getAllDocuments';
    try {
        const response = await axios.get(url);
        const body = await response.data;
        return body;
    } catch (e) {
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
}

export const getDocumentsByREMDB = async (email) => {
    const url = urlHead + '/getDocumentsByREM/'+email;
    try {
        const response = await axios.get(url);
        const body = await response.data;
        return body;
    } catch (e) {
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
};

export const createDocumentDB = async (file, data) => {
    const url = urlHead + '/createDocument';
    try {
        const formData = new FormData();
        formData.append('image', file);
        Object.keys(data).map((key) => {
            formData.append(key, data[key]);
        });
        const response = await axios.post(url, formData, imageConfig);
        const body = await response.data;
        return body;
    } catch (e) {
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
};

export const revokeDocumentDB = async (cert_id) => {
    const url = urlHead + '/revokeDocument/'+cert_id;
    try {
        const response = await axios.put(url, config);
        const body = await response.data;
        return body;
    } catch (e) {
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
};

export const restoreDocumentDB = async (cert_id) => {
    const url = urlHead + '/restoreDocument/'+cert_id;
    try {
        const response = await axios.put(url, config);
        const body = await response.data;
        return body;
    } catch (e) {
        var error = await e.response.data.message;
        return {
            success: false,
            message: error
        }
    }
};