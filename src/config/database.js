const { Sequelize } = require('sequelize');
const fs = require('fs');
require("dotenv").config();

let sequelize;

if (process.env.ENV === 'dev') {
    sequelize = new Sequelize({
        dialect: process.env.POSTGRES_DIALECT,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USERNAME_DEV,
        password: process.env.POSTGRES_PASSWORD_DEV,
        database: process.env.POSTGRES_DATABASE_DEV
    });
} 
// else {
//     sequelize = new Sequelize(process.env.DATABASE_URL, {
//         dialect: 'postgres',
//         protocol: 'postgres',
//         logging: false,
//         dialectOptions: process.env.ENV === 'production' ? {
//             ssl: {
//                 require: true,
//                 rejectUnauthorized: false,
//                 ca: fs.existsSync('/etc/letsencrypt/live/volero.com/fullchain.pem') 
//                     ? fs.readFileSync('/etc/letsencrypt/live/volero.com/fullchain.pem').toString() 
//                     : undefined,
//                 key: fs.existsSync('/etc/letsencrypt/live/volero.com/privkey.pem') 
//                     ? fs.readFileSync('/etc/letsencrypt/live/volero.com/privkey.pem').toString() 
//                     : undefined,
//                 cert: fs.existsSync('/etc/letsencrypt/live/volero.com/cert.pem') 
//                     ? fs.readFileSync('/etc/letsencrypt/live/volero.com/cert.pem').toString() 
//                     : undefined,
//             }
//         } : {}
//     });
// }

module.exports = sequelize;
