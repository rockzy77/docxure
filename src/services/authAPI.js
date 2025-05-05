import axios from 'axios';

axios.defaults.withCredentials = true;

const config = {
    headers: {
        "Content-Type": "application/json"
    }
};


const imageConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

const urlHead = 'http://localhost:3001/api/v2';

export const registerLedgerDB = async (data) => {
    const url = urlHead + '/registerLedger';
    try {
        const response = await axios.post(url, data, config);
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

export const loginLedgerDB = async (data) => {
    const url = urlHead + '/loginLedger';
    try {
        const response = await axios.post(url, data, config);
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

export const getUserByTokenDB = async (token) => {
    const url = urlHead + '/getUserByToken';
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}` // Pass token in headers
            }
        });
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

export const getAllUsersDB = async (token) => {
    const url = urlHead + '/getAllUsers';
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}` // Pass token in headers
            }
        });
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


export const updateUSerDB = async (lid, data) => {
    const url = urlHead + '/updateUser/' + lid;
    try {
        const response = await axios.put(url, data, config);
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