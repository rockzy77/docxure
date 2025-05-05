const Sequelize = require('sequelize');
const sequelize = require('../services/db');

const LEDGER = require("../models/LedgerModel")

const DOCUMENT = sequelize.define("DOCUMENTS", {
    DID: {
        type: Sequelize.BIGINT(10),
        primaryKey: true,
        autoIncrement: true
    },
    LID: {
        type: Sequelize.BIGINT(10),
        references: {
            model: LEDGER,
            key: 'LID'
        }
    },
    DNAME: {
        type: Sequelize.STRING(30),
    },
    ISS_NAME: {
        type: Sequelize.STRING(30),
    },
    ISS_EMAIL: {
        type: Sequelize.STRING(30),
    },
    REC_NAME: {
        type: Sequelize.STRING(30),
    },
    REC_EMAIL: {
        type: Sequelize.STRING(30),
    },
   DURL: {
        type: Sequelize.STRING(150),
    },
    IS_ACTIVE: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
})

module.exports = DOCUMENT;