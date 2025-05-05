const {Blockchain, P2PNetwork, Block} = require("./blockchain");

const express = require("express");
const app = express();

const blockchain = new Blockchain();
const p2p = new P2PNetwork(blockchain);

require("dotenv").config();


app.use(express.json());

app.get("/blocks", async (req, res) => {
    const receivedChains = await p2p.requestBlockchainFromPeers();

    // Process received chains
    receivedChains.forEach(chain => {
        p2p.replaceChainIfNeeded(chain);
    });

    // Send the latest synced blockchain
    res.json(blockchain.chain);
});

app.post("/add-block", (req, res) => {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Data is required" });
    const previousHash = blockchain.getLatestBlock().hash;
    const newBlock = new Block(blockchain.chain.length, Date.now(), data.docId, data.docHash, data.docSign, previousHash);
    blockchain.addBlock(newBlock);
    p2p.broadcastBlock(newBlock); // Sync with peers

    res.json(newBlock);
});

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const P2P_PORT = process.env.P2P_PORT || 6001;

app.listen(HTTP_PORT, () => {
    console.log(`Blockchain API running on port ${HTTP_PORT}`);
});

p2p.startServer(P2P_PORT);
