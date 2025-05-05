const Sequelize = require('sequelize');
const sequelize = require('../services/db');

const ACTIONLOG = sequelize.define("ACTIONLOG", {
    ALID: {
        type: Sequelize.BIGINT(10),
        primaryKey: true,
        autoIncrement: true
    },
    TYPE: {
        type: Sequelize.STRING(20),
    },
    ACTION: {
        type: Sequelize.STRING(20),
    },
    ACTION_BY: {
        type: Sequelize.BIGINT(10),
    },
})

module.exports = ACTIONLOG;