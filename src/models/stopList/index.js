const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const StopList = db.define(
    "StopList",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        salesId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        tableName: "stopList"
    }
)

module.exports = StopList