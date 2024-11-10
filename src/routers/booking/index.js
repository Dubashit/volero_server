const router = require('express').Router()
const { Op, where } = require('sequelize');
const Booking = require('../../models/booking')
const Agent = require('../../models/agent')

// router.get('/search', async (req, res) => {
//     const { salesId, percentage } = req.query;
//     console.log('Received query:', { salesId, percentage });

//     try {
//         const whereClause = {};
//         if (salesId) {
//             whereClause.salesId = {
//                 [Op.iLike]: `%${salesId}%`
//             };
//         }
//         if (percentage) {
//             whereClause.percentage = {
//                 [Op.iLike]: `%${percentage}%`
//             };
//         }
//         console.log('Constructed whereClause:', whereClause);
//         const coefficients = await Coefficient.findAll({
//             where: whereClause
//         });
//         console.log('Found coefficients:', coefficients);
//         res.json(coefficients);
//     } catch (error) {
//         console.error('Error fetching coefficients:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });



router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.findAll()
        res.status(200).json(bookings)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const booking = await Booking.findOne({ where: { id } })
        res.status(200).json(booking)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})


router.get('/userId/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const userBookings = await Booking.findAll({ where: { userId } })
        res.status(200).json(userBookings)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/', async (req, res) => {
    const { userId, sellingPrice, currency } = req.body
    try {
        const booking = await Booking.create({
            userId,
            sellingPrice,
            pointsCollected: (sellingPrice * 0.005).toFixed(2),
            currency
        })
        const agent = await Agent.findOne({ where: { id: userId } });

        const bonus = sellingPrice * 0.005;

        let usd = agent.dataValues.usd;
        let eur = agent.dataValues.eur;
        let gbp = agent.dataValues.gbp;

        if (currency === 'USD') {
            usd = parseFloat(agent.dataValues.usd) + parseFloat(bonus.toFixed(2));
        } else if (currency === 'EUR') {
            eur = parseFloat(agent.dataValues.eur) + parseFloat(bonus.toFixed(2));
        } else if (currency === 'GBP') {
            gbp = parseFloat(agent.dataValues.gbp) + parseFloat(bonus.toFixed(2));
        } else {
            return res.status(400).json({ error: 'Invalid currency' });
        }

        await Agent.update({
            usd: usd,
            eur: eur,
            gbp: gbp
        }, { where: { id: userId } })

        res.status(200).json(booking)
    } catch (error) {
        console.error(error);
        res.status(501).json({ error: "Internal server error" })
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const { userId, sellingPrice, pointsCollected, currency } = req.body
    try {
        const booking = await Booking.update({
            userId,
            sellingPrice,
            pointsCollected,
            currency
        }, { where: { id } })
        res.status(200).json(booking)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        await Booking.destroy({ where: { id } })
        res.status(200).json({ message: "Booking deleted successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



module.exports = router