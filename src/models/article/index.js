const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const Article = db.define(
    "Article",
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
        author: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        },
        seoUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        seoTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        seoDescription: {
            type: DataTypes.STRING,
            allowNull: false
        },
        relatedArticles: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        preview: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        readTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "articles"
    }
)

module.exports = Article