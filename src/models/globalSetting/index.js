const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const GlobalSetting = db.define(
    "GlobalSetting",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        percentage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        days: {
            type : DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "globalSetting"
    }
)

module.exports = GlobalSetting