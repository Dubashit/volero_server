const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const Testimonial = db.define(
    "Testimonial",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        countOfStars: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        relation: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "testimonials"
    }
)

module.exports = Testimonial