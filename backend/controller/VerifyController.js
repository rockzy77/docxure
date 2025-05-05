const crypto = require("isomorphic-webcrypto");
const DOCUMENTS = require("../models/DocumentsModel")
const LEDGER = require("../models/LedgerModel");
const fs = require("fs/promises");
const { getLatestBlocks } = require("./BlockChainController");
const ACTIONLOG = require("../models/ActionLogModel");



exports.verifyDocument = async (req, res) => {
    const { DID } = req.body;
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Please upload a file" });
    }

    try {
        // 🔹 Convert PEM public key to binary
        function pemToBinary(pem) {
            const b64Lines = pem.replace(/-----.*?-----/g, "").replace(/\s+/g, "");
            return Uint8Array.from(atob(b64Lines), c => c.charCodeAt(0));
        }

        // 🔹 Convert hex hash back to Uint8Array for verification
        function hexToBytes(hex) {
            return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        }
        const document = await DOCUMENTS.findByPk(DID);
        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        const ledger = await LEDGER.findByPk(document.LID);
        const blocks = await getLatestBlocks();
        const block = blocks.find(block => block.data.docId == DID);
        if (!block) {
            return res.status(404).json({ success: false, message: "Document verification cannot be processed." });
        }
        

        const public_key = ledger.LPUBLIC_KEY; // Stored public key
        const storedHashHex = block.data.docHash;
        const storedSignatureBase64 = block.data.docSign;

        // Read file contents
        const fileBuffer = await fs.readFile(req.file.path);
        const fileContent = new Uint8Array(fileBuffer);

        // 🔹 Compute hash using the same method as frontend
        const hashBuffer = await crypto.subtle.digest("SHA-256", fileContent);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const computedHashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        // Compare computed hash with stored hash
        if (computedHashHex !== storedHashHex) {
            await ACTIONLOG.create({
                TYPE: 'document',
                ACTION: 'verification_failed',
                ACTION_BY: DID
            });
            return res.status(400).json({ success: false, message: "Document hash does not match stored hash", document });
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

        // 🔹 Convert stored signature from Base64 to Uint8Array
        const signatureBuffer = new Uint8Array(Buffer.from(storedSignatureBase64, "base64"));


        const storedHashBuffer = hexToBytes(storedHashHex);

        // 🔹 Verify the signature
        const isVerified = await crypto.subtle.verify(
            { name: "RSA-PSS", saltLength: 32 },
            publicKeyObj,
            signatureBuffer,
            storedHashBuffer // ✅ Corrected to use raw bytes instead of string encoding
        );

        if (!isVerified) {
            await ACTIONLOG.create({
                TYPE: 'document',
                ACTION: 'verification_failed',
                ACTION_BY: DID
            });
            return res.status(400).json({ success: false, message: "Signature verification failed", document });
        }

        await ACTIONLOG.create({
            TYPE: 'document',
            ACTION: 'verification_success',
            ACTION_BY: DID
        });

        res.status(200).json({ success: true, message: "Document verification successful", document });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ success: false, message: "Error verifying document", details: error.message });
    }
};
