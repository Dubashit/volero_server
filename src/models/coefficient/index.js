const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const Coefficient = db.define(
    "Coefficient",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        salesId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        percentage: {
            type : DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "coefficients"
    }
)

module.exports = Coefficient