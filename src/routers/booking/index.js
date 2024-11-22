const router = require('express').Router()
const { Op, where } = require('sequelize');
const Booking = require('../../models/booking')
const Agent = require('../../models/agent');
const Coefficient = require('../../models/coefficient');
const GlobalSetting = require('../../models/globalSetting');
const StopList = require('../../models/stopList');

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
        const booking = await Booking.findAll({ where: { userId } })
        res.status(200).json(booking)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})



router.post('/', async (req, res) => {
    const { id, userId, sellingPrice, currency } = req.body;

    try {
        const agent = await Agent.findOne({ where: { id: userId } });
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const stopLists = await StopList.findAll({ where: { salesId: agent.salesId } });

        const stopListWithUsername = stopLists.find(stop => stop.username === agent.username);
        const stopListWithoutUsername = stopLists.find(stop => !stop.username || stop.username === '');

        let pointsCollected = 0

        if (!stopListWithUsername && !stopListWithoutUsername) {
            const globalCoef = await GlobalSetting.findOne();
            const coefficient = await Coefficient.findOne({ where: { salesId: agent.salesId } });

            if (coefficient) {
                pointsCollected = parseFloat((sellingPrice * coefficient.percentage / 100).toFixed(2));
            } else if (globalCoef) {
                pointsCollected = parseFloat((sellingPrice * globalCoef.percentage / 100).toFixed(2));
            } else {
                pointsCollected = parseFloat((sellingPrice * 0.005).toFixed(2))
            }
        }

        const existingBooking = await Booking.findOne({ where: { id } });

        if (existingBooking) {
            console.log('Booking already exists:', existingBooking);
            return res.status(200).json({ ...existingBooking.dataValues });
        }

        const booking = await Booking.create({
            id,
            userId,
            sellingPrice,
            pointsCollected,
            currency,
        });

        let { usd, eur, gbp } = agent;

        switch (currency) {
            case 'USD':
                usd = parseFloat(usd) + parseFloat(pointsCollected);
                break;
            case 'EUR':
                eur = parseFloat(eur) + parseFloat(pointsCollected);
                break;
            case 'GBP':
                gbp = parseFloat(gbp) + parseFloat(pointsCollected);
                break;
            default:
                return res.status(400).json({ error: 'Invalid currency' });
        }

        await Agent.update(
            { usd, eur, gbp },
            { where: { id: userId } }
        );

        console.log('Booking created:', booking);
        return res.status(201).json({ ...booking.dataValues });

    } catch (error) {
        console.error('Error processing booking:', error);
        res.status(501).json({ error: 'Internal server error' });
    }
});



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