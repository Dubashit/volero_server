const router = require('express').Router()
const { Op, where } = require('sequelize');
const Agent = require('../../models/agent');

router.get('/search', async (req, res) => {
    const { salesId, username, reseller } = req.query;
    console.log('Received query:', { salesId, username, reseller });

    try {
        const whereClause = {};
        if (salesId) {
            whereClause.salesId = {
                [Op.iLike]: `%${salesId}%`
            };
        }
        if (username) {
            whereClause.username = {
                [Op.iLike]: `%${username}%`
            };
        }
        if (reseller) {
            whereClause.reseller = {
                [Op.iLike]: `%${reseller}%`
            };
        }
        console.log('Constructed whereClause:', whereClause);
        const coefficients = await Agent.findAll({
            where: whereClause
        });
        console.log('Found coefficients:', coefficients);
        res.status(200).json(coefficients);
    } catch (error) {
        console.error('Error fetching coefficients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/', async (req, res) => {
    try {
        const agents = await Agent.findAll()
        res.status(200).json(agents)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/pointsData/:username/:salesId', async (req, res) => {
    const username = req.params.username
    const salesId = req.params.salesId
    try {
        const agent = await Agent.findOne({ where: { username, salesId } })
        if (agent) {
            res.status(200).json(agent)
        } else {
            res.status(404).json({ message: 'Agent not found' })
        }
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