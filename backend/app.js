const express = require('express');
const app = express();
const sequelize = require('./services/db');
const PORT = 3001;
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});


exports.upload = multer({ storage });





// routers
const LedgerRouter = require('./routers/LedgerRouter');
const LedgerProcessRouter = require('./routers/LedgerProcessRouter');
const DocumentRouter = require('./routers/DocumentRouter');
const ActionLogRouter = require('./routers/ActionLogRouter');
const VerifyRouter = require('./routers/VerifyRouter');


var cors = require('cors');


// server config

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({
    limit: '20mb'
}));
app.use(bodyParser.json({
    limit: '20mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));

// router call
app.use('/api/v2', LedgerRouter);
app.use('/api/v2', LedgerProcessRouter);
app.use('/api/v2', DocumentRouter);
app.use('/api/v2', ActionLogRouter);
app.use('/api/v2', VerifyRouter);



// Database init
async function syncDB() {
    try {
        await sequelize.sync({ force: false }); // Drops existing tables and re-creates them
        console.log('✅ Database synced successfully.');
    } catch (error) {
        console.error('❌ Database sync error:', error);
    }
}

syncDB();


// Request Handlers
app.get("/ping", (req, res)=>{
    res.send("Working!")
});

// Server init
app.listen(PORT, ()=>{
    console.log(`Server listening on PORT ${PORT}`)
});