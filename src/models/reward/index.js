const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const Reward = db.define(
    "Reward",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pool: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        expireDate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "rewards"
    }
)

Reward.beforeCreate((reward) => {
    const createdAt = reward.createdAt || new Date();
    const expireDate = new Date(createdAt);
    expireDate.setFullYear(expireDate.getFullYear() + 2);
    reward.expireDate = expireDate;
});

module.exports = Reward