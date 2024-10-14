const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const Vacancy = db.define(
    "Vacancy",
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
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        seoUrl:{
            type:DataTypes.STRING,
            allowNull:true
        },
        seoTitle:{
            type:DataTypes.STRING,
            allowNull:false
        },
        seoDescription:{
            type:DataTypes.STRING,
            allowNull:false
        },
        body:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        location:{
            type:DataTypes.STRING,
            allowNull:false
        },
        employmentType:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },
    {
        tableName: "vacancies"
    }
)

module.exports = Vacancy