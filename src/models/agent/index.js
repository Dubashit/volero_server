const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const Agent = db.define(
    "Agent",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        reseller: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salesId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usd: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        eur: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        gbp: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    },
    {
        tableName: "agents"
    }
)

module.exports = Agent