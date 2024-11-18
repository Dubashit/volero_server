const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const RequestForPoints = db.define(
    "RequestForPoints",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isDone: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "requestsForPoints"
    }
)

module.exports = RequestForPoints