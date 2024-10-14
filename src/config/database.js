const { Sequelize } = require('sequelize')

// const sequelize = new Sequelize({
//     dialect: "postgres",
//     host: "localhost",
//     port: "5432",
//     username: "postgres",
//     password: "root",
//     database: "admin"
// })

const sequelize = new Sequelize({
    dialect: "postgres",
    connectionString: process.env.POSTGRES_URL,
    username: "postgres",
    password: "root",
    database: "admin"
})

module.exports = sequelize