const sequelize = require('../config/database');
const Admin = require('./Admin');

const db = {
    sequelize,
    Admin,
};

module.exports = db;
