const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize(
        process.env.DATABASE_URL || `postgresql://postgres:priyu@1234@12@db.cosejehimqfdzsrcivwj.supabase.co:5432/postgres`,
        {
            dialect: 'postgres',
            protocol: 'postgres',
            logging: false,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        }
    );
} else {
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
