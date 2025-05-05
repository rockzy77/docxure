import axios from 'axios';

axios.defaults.withCredentials = true;

const config = {
    headers: {
        "Content-Type": "application/json"
    }
};


const imageConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

const urlHead = 'http://localhost:3001/api/v2';

export const createActionLogDB = async (log) => {
    var url = urlHead + '/createActionLog';
    try {
        const response = await axios.post(url, log, config);
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

export const deleteUserDB = async (lid) => {
    var url = urlHead + '/deleteUser/' + lid;
    try {
        const response = await axios.delete(url);
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