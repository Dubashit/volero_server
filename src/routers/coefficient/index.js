const router = require('express').Router()
const { Op } = require('sequelize');
const Coefficient = require('../../models/coefficient')

router.get('/search', async (req, res) => {
    const { salesId, percentage } = req.query;
    console.log('Received query:', { salesId, percentage });

    try {
        const whereClause = {};
        if (salesId) {
            whereClause.salesId = {
                [Op.iLike]: `%${salesId}%`
            };
        }
        if (percentage) {
            whereClause.percentage = {
                [Op.iLike]: `%${percentage}%`
            };
        }
        console.log('Constructed whereClause:', whereClause);
        const coefficients = await Coefficient.findAll({
            where: whereClause
        });
        console.log('Found coefficients:', coefficients);
        res.json(coefficients);
    } catch (error) {
        console.error('Error fetching coefficients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/', async (req, res) => {
    try {
        const coefficients = await Coefficient.findAll()
        res.status(200).json(coefficients)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const coefficient = await Coefficient.findOne({ where: { id } })
        res.status(200).json(coefficient)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/', async (req, res) => {
    const { salesId, percentage } = req.body
    try {
        const existingCoefficient = await Coefficient.findOne({ where: { salesId } });
        if (existingCoefficient) {
            return res.status(400).json({error:'error'});
        }
        const coefficient = await Coefficient.create({ salesId, percentage })
        res.status(200).json(coefficient)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const { salesId, percentage } = req.body
    try {
        const coefficient = await Coefficient.update({ salesId: salesId, percentage: percentage }, { where: { id } })
        res.status(200).json(coefficient)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        await Coefficient.destroy({ where: { id } })
        res.status(200).json({ message: "Coefficient deleted successfully" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



module.exports = router