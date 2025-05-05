const fs = require("fs");
const path = require("path");

const WebSocket = require("ws");

const crypto = require("crypto");

// Block Class
class Block {
    constructor(index, timestamp, docId, docHash, docSign, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = {docId, docHash, docSign};  // Document hash or any data
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    // Generate Block Hash
    calculateHash() {
        return crypto.createHash("sha256")
            .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce)
            .digest("hex");
    }

    // Proof of Work - Simple Mining
    // mineBlock(difficulty) {
    //     while (!this.hash.startsWith("0".repeat(difficulty))) {
    //         this.nonce++;
    //         this.hash = this.calculateHash();
    //     }
    //     console.log(`Block mined: ${this.hash}`);
    // }
}

// Blockchain Class
class Blockchain {
    constructor() {
        this.filePath = path.join(__dirname, "blockchain.json");
        this.chain = this.loadBlockchain() || [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, 1710000000000, 0, "Genesis Block", "", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        this.chain.push(newBlock);
        this.saveBlockchain();  // Save blockchain after adding a new block
    }

    isValidChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) return false;
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }

    saveBlockchain() {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            fs.writeFileSync(this.filePath, JSON.stringify(this.chain, null, 4));
        }, 2000); // Save every 2 seconds instead of every block addition
    }
    

    loadBlockchain() {
        if (fs.existsSync(this.filePath)) {
            try {
                const data = fs.readFileSync(this.filePath, "utf8");
                const parsedData = JSON.parse(data);
                return parsedData.map(
                    (b) => new Block(b.index, b.timestamp, b.data.docId, b.data.docHash, b.data.docSign, b.previousHash)
                );
            } catch (error) {
                console.error("Error loading blockchain:", error);
                return null;
            }
        }
        return null;
    }
}



class P2PNetwork {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
        this.peers = ["ws://localhost:6001"]; // List of other nodes
    }

    startServer(port) {
        const server = new WebSocket.Server({ port });

        server.on("connection", (socket) => {
            this.connectSocket(socket);
            socket.send(JSON.stringify({ type: "REQUEST_BLOCKCHAIN" })); // Request latest chain on connect
        });
    
        this.peers.forEach((peer) => {
            const socket = new WebSocket(peer);
            socket.on("open", () => {
                this.connectSocket(socket);
                socket.send(JSON.stringify({ type: "REQUEST_BLOCKCHAIN" })); // Sync on new connection
            });
        });

        console.log(`P2P server running on port ${port}`);
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        socket.on("message", (message) => this.handleMessage(message, socket));
    }

    requestBlockchainFromPeers() {
        if (this.sockets.length === 0) return Promise.resolve([]);
    
        return new Promise((resolve) => {
            let receivedChains = [];
            let responsesReceived = 0;
    
            this.sockets.forEach((socket) => {
                socket.send(JSON.stringify({ type: "REQUEST_BLOCKCHAIN" }));
    
                socket.once("message", (message) => {
                    try {
                        const data = JSON.parse(message);
                        if (data.type === "BLOCKCHAIN") {
                            receivedChains.push(data.chain);
                        }
                    } catch (error) {
                        console.error("Error parsing received blockchain:", error);
                    }
    
                    responsesReceived++;
                    if (responsesReceived === this.sockets.length) {
                        resolve(receivedChains);
                    }
                });
            });
    
            setTimeout(() => resolve(receivedChains), 5000); // Avoid blocking forever
        });
    }
    
    

    handleMessage(message, socket) {
        const data = JSON.parse(message);
    
        if (data.type === "NEW_BLOCK") {
            const receivedBlock = data.block;
            const latestBlock = this.blockchain.getLatestBlock();
            
    
            // Check if the block is valid and hasn't been added already
            if (receivedBlock.index === latestBlock.index + 1 && receivedBlock.previousHash === latestBlock.hash) {
                this.blockchain.addBlock(receivedBlock);
                console.log("Received and added new block:", receivedBlock);
            } else {
                console.log("Received an invalid or duplicate block. Ignoring.");
            }
        }

        else if (data.type === "REQUEST_BLOCKCHAIN") {
            socket.send(JSON.stringify({ type: "BLOCKCHAIN", chain: this.blockchain.chain }));
        } 
        else if (data.type === "BLOCKCHAIN") {
            this.replaceChainIfNeeded(data.chain);
        }
    }

    replaceChainIfNeeded(receivedChain) {
        console.log("Received chain length:", receivedChain.length);
        console.log("Local chain length:", this.blockchain.chain.length);
        if (!Array.isArray(receivedChain) || receivedChain.length === 0) {
            console.log("Invalid chain received.");
            return;
        }
    
        if (receivedChain.length > this.blockchain.chain.length && this.blockchain.isValidChain(receivedChain)) {
            console.log("Replacing local chain with longer valid chain.");
            this.blockchain.chain = receivedChain;
        } else {
            console.log("Received chain is invalid or not longer. Keeping local chain.");
        }
    }

    broadcastBlock(block) {
        this.sockets.forEach((socket) =>
            socket.send(JSON.stringify({ type: "NEW_BLOCK", block }))
        );
    }
}


module.exports = {Blockchain, P2PNetwork, Block}