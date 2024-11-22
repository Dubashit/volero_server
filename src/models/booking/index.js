const { DataTypes } = require('sequelize')
const db = require('../../config/database')

const Booking = db.define(
    "Booking",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sellingPrice: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        pointsCollected: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false
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
        tableName: "bookings"
    }
)

Booking.beforeCreate((booking) => {
    const createdAt = booking.createdAt || new Date();
    const expireDate = new Date(createdAt);
    expireDate.setFullYear(expireDate.getFullYear() + 2);
    booking.expireDate = expireDate;
});

module.exports = Booking