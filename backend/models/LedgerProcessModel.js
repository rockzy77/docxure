const Sequelize = require('sequelize');
const sequelize = require('../services/db');

const LEDGER = require("../models/LedgerModel")

const LEDGERPROCESS = sequelize.define("LEDGERPROCESS", {
    LPID: {
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
    DOCURL: {
        type: Sequelize.STRING(150)
    },
    STATUS: {
        type:  Sequelize.STRING(20)
    }
})


module.exports = LEDGERPROCESS;