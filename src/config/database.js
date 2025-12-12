const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

if (process.env.NODE_ENV === 'production') {
    //--------------server postgre sql -----------
    // sequelize = new Sequelize(
    // process.env.DB_NAME,
    // process.env.DB_USER,
    // process.env.DB_PASS,
    // {
    //     host: process.env.DB_HOST,
    //     dialect: 'postgres',
    //     port: process.env.DB_PORT || 5432,
    //     logging: false,
    // }
    // );
    // ----------------- local postgresql ---------------------
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    });

} else {
    //-------------------- local mysql ---------------------
    sequelize = new Sequelize(
        process.env.DB_NAME || 'elkjournals',
        process.env.DB_USER || 'root',
        process.env.DB_PASS || 'root@123',
        {
            host: process.env.DB_HOST || '127.0.0.1',
            dialect: 'mysql',
            logging: false,
        }
    );
}

module.exports = sequelize;
