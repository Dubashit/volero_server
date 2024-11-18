const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const Tag = db.define(
    "Tag",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        tableName: "tags"
    }
)

module.exports = Tag