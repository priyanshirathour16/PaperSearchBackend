const sequelize = require('../config/database');

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Dialect: ${sequelize.getDialect()}`);

if (process.env.NODE_ENV === 'production' && sequelize.getDialect() === 'postgres') {
    console.log('SUCCESS: Production uses postgres');
} else if ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && sequelize.getDialect() === 'mysql') {
    console.log('SUCCESS: Development uses mysql');
} else {
    console.log('FAILURE: Incorrect dialect for environment');
}

process.exit(0);
