const { Sequelize } = require('sequelize')
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
    sequelize = new Sequelize({
        dialect: process.env.POSTGRES_DIALECT,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE
    })
}


module.exports = sequelize