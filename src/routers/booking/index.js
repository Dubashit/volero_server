const router = require('express').Router()
const { Op, where } = require('sequelize');
const Booking = require('../../models/booking')
const Agent = require('../../models/agent');
const Coefficient = require('../../models/coefficient');
const GlobalSetting = require('../../models/globalSetting');
const StopList = require('../../models/stopList');

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
        const booking = await Booking.findAll({ where: { userId } })
        res.status(200).json(booking)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})


router.post('/', async (req, res) => {
    const { userId, sellingPrice, currency } = req.body;

    try {
        // Получаем агента по userId
        const agent = await Agent.findOne({ where: { id: userId } });
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        // Проверяем стоплист
        const stopLists = await StopList.findAll({ where: { salesId: agent.salesId } });

        // Проверяем, есть ли стоплист с username агента
        const stopListWithUsername = stopLists.find(stop => stop.username === agent.username);

        // Проверяем, есть ли глобальный стоплист с salesId
        const stopListWithoutUsername = stopLists.find(stop => !stop.username || stop.username === '');

        let pointsCollected = 0;
        let reason = null;

        if (!stopListWithUsername && !stopListWithoutUsername) {
            // Если агент не в стоплисте, рассчитываем pointsCollected
            const globalCoef = await GlobalSetting.findOne();
            const coefficient = await Coefficient.findOne({ where: { salesId: agent.salesId } });

            if (coefficient) {
                pointsCollected = (sellingPrice * coefficient.percentage / 100).toFixed(2);
            } else if (globalCoef) {
                pointsCollected = (sellingPrice * globalCoef.percentage / 100).toFixed(2);
            }
        } else {
            // Если агент или salesId в стоплисте, устанавливаем причину
            reason = "Stop List";
        }

        // Создаем запись бронирования
        const booking = await Booking.create({
            userId,
            sellingPrice,
            pointsCollected,
            currency
        });

        // Рассчитываем и обновляем валютные бонусы агента
        let { usd, eur, gbp } = agent;

        if (currency === 'USD') {
            usd = parseFloat(usd) + parseFloat(pointsCollected);
        } else if (currency === 'EUR') {
            eur = parseFloat(eur) + parseFloat(pointsCollected);
        } else if (currency === 'GBP') {
            gbp = parseFloat(gbp) + parseFloat(pointsCollected);
        } else {
            return res.status(400).json({ error: 'Invalid currency' });
        }

        await Agent.update(
            { usd, eur, gbp },
            { where: { id: userId } }
        );

        res.status(200).json({ ...booking.dataValues, reason });

    } catch (error) {
        console.error(error);
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