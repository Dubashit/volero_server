const router = require('express').Router()
const { Op } = require('sequelize');
const Reward = require('../../models/reward')
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
        const rewards = await Reward.findAll()
        res.status(200).json(rewards)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const reward = await Reward.findOne({ where: { id } })
        res.status(200).json(reward)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})


router.get('/userId/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const userReward = await Reward.findAll({ where: { userId } })
        res.status(200).json(userReward)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/', async (req, res) => {
    const { userId, type, pool, amount, comment } = req.body

    try {
        const reward = await Reward.create({
            userId,
            type,
            pool,
            amount,
            comment
        })

        const agent = await Agent.findOne({ where: { id: userId } });

        let usd = agent.dataValues.usd;
        let eur = agent.dataValues.eur;
        let gbp = agent.dataValues.gbp;

        if (pool === 'USD') {
            if(type === '+')
                usd = parseFloat(agent.dataValues.usd) + parseFloat(amount);
            if(type === '-')
                usd = parseFloat(agent.dataValues.usd) + parseFloat(-amount);
        } else if (pool === 'EUR') {
            if(type === '+')
                eur = parseFloat(agent.dataValues.eur) + parseFloat(amount);
            if(type === '-')
                eur = parseFloat(agent.dataValues.eur) + parseFloat(-amount);
        } else if (pool === 'GBP') {
            if(type === '+')
                gbp = parseFloat(agent.dataValues.gbp) + parseFloat(amount);
            if(type === '-')
                gbp = parseFloat(agent.dataValues.gbp) + parseFloat(-amount);
        } else {
            return res.status(400).json({ error: 'Invalid currency' });
        }

        await Agent.update({
            usd: usd,
            eur: eur,
            gbp: gbp
        }, { where: { id: userId } })

        res.status(200).json(reward)
    } catch (error) {
        console.error(error);
        res.status(501).json({ error: "Internal server error" })
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const { userId, type, pool, amount, comment } = req.body
    try {
        const reward = await Reward.update({
            userId,
            type,
            pool,
            amount,
            comment
        }, { where: { id } })
        res.status(200).json(reward)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        await Reward.destroy({ where: { id } })
        res.status(200).json({ message: "Reward deleted successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



module.exports = router