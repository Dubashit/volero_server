const { Sequelize } = require('sequelize')
const fs = require('fs');
require("dotenv").config()

let sequelize;

if(process.env.ENV === 'dev'){
    sequelize = new Sequelize({
        dialect: process.env.POSTGRES_DIALECT,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USERNAME_DEV,
        password: process.env.POSTGRES_PASSWORD_DEV,
        database: process.env.POSTGRES_DATABASE_DEV
    })
} else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
                ca: fs.readFileSync('/etc/letsencrypt/live/volerò.com/fullchain.pem').toString(),
                key: fs.readFileSync('/etc/letsencrypt/live/volerò.com/privkey.pem').toString(),
                cert: fs.readFileSync('/etc/letsencrypt/live/volerò.com/cert.pem').toString(),
            }
        }
    });
}


module.exports = sequelize