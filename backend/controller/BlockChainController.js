const axios = require("axios");

axios.defaults.withCredentials = true;

const config = {
    headers: {
        "Content-Type": "application/json"
    }
};


const urlHead = 'http://localhost:3002/';

exports.getLatestBlocks = async () => {
    const url = urlHead + 'blocks';
    try {
        const response = await axios.get(url, config);
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


exports.createBlock = async (docId, docHash, docSign) => {
    const url = urlHead + 'add-block';
    try {
        const response = await axios.post(url, {
            data: {
                docId,
                docHash,
                docSign
            }
        }, config);
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