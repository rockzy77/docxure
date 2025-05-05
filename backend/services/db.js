const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('docxuredb', 'root', '', {
    // host: 'db-postgres', 
    host: 'localhost',
    dialect: 'mysql', 
    logging: false, 
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Mysql connected successfully!');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = sequelize;
