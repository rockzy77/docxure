const Sequelize = require('sequelize');
const sequelize = require('../services/db');

const LEDGER = sequelize.define("LEDGER", {
    LID: {
        type: Sequelize.BIGINT(10),
        primaryKey: true,
        autoIncrement: true
    },
    LNAME: {
        type: Sequelize.STRING(30),
    },
    LTYPE: {
        type: Sequelize.STRING(10)
    },
    LEMAIL: {
        type: Sequelize.STRING(30)
    },
    LPHONE: {
        type: Sequelize.STRING(12)
    },
    LPASSWORD: {
        type: Sequelize.STRING(150)
    },
    LADDRESS: {
        type: Sequelize.STRING(150),
    },
    LPROFILE_PIC: {
        type: Sequelize.STRING(200)
    },
    LPUBLIC_KEY: {
        type: Sequelize.TEXT
    },
    FIRST_LOGIN: {
        type: Sequelize.BOOLEAN
    },
    IS_ACTIVE: {
        type: Sequelize.BOOLEAN
    }
})

module.exports = LEDGER;