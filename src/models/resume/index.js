const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const Resume = db.define(
    "Resume",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vacancy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        countryCode:{
            type:DataTypes.STRING,
            allowNull:true
        },
        phone: {
            type:DataTypes.STRING,
            allowNull:true
        },
        city:{
            type:DataTypes.STRING,
            allowNull:false
        },
        linkedIn:{
            type:DataTypes.STRING,
            allowNull:false
        },
        source:{
            type:DataTypes.STRING,
            allowNull:true
        },
        cv:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },
    {
        tableName: "resume"
    }
)

module.exports = Resume