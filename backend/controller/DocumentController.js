const DOCUMENTS = require('../models/DocumentsModel');
const ACTION = require("../models/ActionLogModel");
const sequelize = require('../services/db');
const { createBlock } = require('./BlockChainController');
const LEDGER = require("../models/LedgerModel");
const crypto = require("isomorphic-webcrypto");

exports.getDocumentByID = async (req, res) => {
    const { id } = req.params;

    try {
        const document = await DOCUMENTS.findByPk(id);

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        res.status(200).json({ document, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching document", details: error });
    }
};

exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await DOCUMENTS.findAll();
        res.status(200).json({ documents, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching document", details: error });
    }
};

exports.getDocumentsByLID = async (req, res) => {
    const { lid } = req.params;

    try {
        const documents = await DOCUMENTS.findAll({
            where: {
                LID: lid
            }
        });

        if (!documents) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        res.status(200).json({ documents, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching document", details: error });
    }
};

exports.getDocumentsByREM = async (req, res) => {
    const { email } = req.params;

    try {
        const documents = await DOCUMENTS.findAll({
            where: {
                REC_EMAIL: email
            }
        });

        if (!documents) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        res.status(200).json({ documents, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching document", details: error });
    }
};

exports.revokeDocument = async (req, res) => {
    const { id } = req.params;

    try {
        const document = await DOCUMENTS.findByPk(id);

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        await document.update({ IS_ACTIVE: false });

        try {
            await ACTION.create({
                TYPE: 'document',
                ACTION: 'revoked',
                ACTION_BY: 1
            });
        } catch (actionError) {
            console.log("Error creating action log: ", actionError);
        }


        res.status(200).json({ success: true, message: "Document revoked successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error revoking document", details: error });
    }
};

exports.restoreDocument = async (req, res) => {
    const { id } = req.params;

    try {
        const document = await DOCUMENTS.findByPk(id);

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        await document.update({ IS_ACTIVE: true });

        try {
            await ACTION.create({
                TYPE: 'document',
                ACTION: 'restored',
                ACTION_BY: 1
            });
        } catch (actionError) {
            console.log("Error creating action log: ", actionError);
        }


        res.status(200).json({ success: true, message: "Document revoked successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error revoking document", details: error });
    }
};

exports.createDocument = async (req, res) => {
    const { LID, DNAME, ISS_NAME, ISS_EMAIL, REC_NAME, REC_EMAIL, DHASH, DSIGN } = req.body;

    try {
        let fileUrl = null;
    
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a file" });
        } else {
            fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }
    
        const ledger = await LEDGER.findByPk(LID);
        const public_key = ledger.LPUBLIC_KEY;
    
        const hashHex = DHASH;  // Hash received from frontend (hex string)
        const signatureBase64 = DSIGN; // Signature from frontend (Base64)
    
        // 🔹 Convert hex string back to Uint8Array (same as frontend)
        function hexToBytes(hex) {
            return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        }
    
        const hashBuffer = hexToBytes(hashHex); // Convert hash back to bytes
    
        // 🔹 Convert PEM public key to binary
        function pemToBinary(pem) {
            const b64Lines = pem.replace(/-----.*?-----/g, "").replace(/\s+/g, "");
            return Uint8Array.from(atob(b64Lines), c => c.charCodeAt(0));
        }
    
        const publicKeyBinary = pemToBinary(public_key);
    
        // 🔹 Import public key for verification
        const publicKeyObj = await crypto.subtle.importKey(
            "spki",
            publicKeyBinary,
            { name: "RSA-PSS", hash: "SHA-256" },
            false,
            ["verify"]
        );
    
        // 🔹 Convert signature from Base64 to Uint8Array
        const signatureBuffer = new Uint8Array(Buffer.from(signatureBase64, "base64"));
    
        // 🔹 Verify the signature
        const isVerified = await crypto.subtle.verify(
            { name: "RSA-PSS", saltLength: 32 },
            publicKeyObj,
            signatureBuffer,
            hashBuffer // ✅ Match the frontend: use raw bytes, not a string
        );
    
        if (!isVerified) {
            return res.status(400).json({ success: false, message: "Signature verification failed" });
        }
    
        const document = await DOCUMENTS.create({
            LID,
            DNAME,
            ISS_NAME,
            ISS_EMAIL,
            REC_NAME,
            REC_EMAIL,
            DURL: fileUrl,
            IS_ACTIVE: true
        });
    
        var bres = await createBlock(document.DID, DHASH, DSIGN);
    
        try {
            await ACTION.create({
                TYPE: "document",
                ACTION: "created",
                ACTION_BY: LID
            });
        } catch (actionError) {
            console.log("Error creating action log: ", actionError);
        }
    
        res.status(200).json({ success: true, message: "Document created successfully", document });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error creating document", details: error });
    }
    
};