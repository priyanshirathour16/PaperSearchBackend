const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'elkjournals',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'root@123',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

module.exports = sequelize;
