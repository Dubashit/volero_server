const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const Language = db.define(
    "Language",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        title: {
            type : DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "languages"
    }
)

module.exports = Language