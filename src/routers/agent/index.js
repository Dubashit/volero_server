const router = require('express').Router()
const { Op, where } = require('sequelize');
const Agent = require('../../models/agent');

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
        const agents = await Agent.findAll()
        res.status(200).json(agents)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/pointsData', async (req, res) => {
    const { username, salesId } = req.query
    try {
        const agent = await Agent.findOne({ where: { username, salesId } })
        res.status(200).json(agent)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const agent = await Agent.findOne({ where: { id } })
        res.status(200).json(agent)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/', async (req, res) => {
    const { reseller, salesId, username, email, fullName, usd, eur, gbp } = req.body
    try {
        const agent = await Agent.create({
            reseller,
            salesId,
            username,
            email: email || '',
            fullName,
            usd,
            eur,
            gbp
        })
        res.status(200).json(agent)
    } catch (error) {
        console.error(error);
        res.status(501).json({ error: "Internal server error" })
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const { reseller, salesId, username, email, fullName, usd, eur, gbp } = req.body
    try {
        const agent = await Agent.update({
            reseller,
            salesId,
            username,
            email: email || '',
            fullName,
            usd,
            eur,
            gbp
        }, { where: { id } })
        res.status(200).json(agent)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.patch('/:id', async (req, res) => {
    const id = req.params.id
    const { email } = req.body
    try {
        const agent = await Agent.update({
            email
        }, { where: { id } })
        res.status(200).json(agent)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        await Agent.destroy({ where: { id } })
        res.status(200).json({ message: "Agent deleted successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



module.exports = router