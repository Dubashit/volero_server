const router = require('express').Router()
const { Op } = require('sequelize');
const StopList = require('../../models/stopList')

router.get('/search', async (req, res) => {
    const { salesId, username } = req.query;
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
        const stopList = await StopList.findAll({
            where: whereClause
        });
        res.json(stopList);
    } catch (error) {
        console.error('Error fetching stop list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const stopLists = await StopList.findAll()
        res.status(200).json(stopLists)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const stopList = await StopList.findOne({ where: { id } })
        res.status(200).json(stopList)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/', async (req, res) => {
    const { salesId, username } = req.body
    try {
        const stopList = await StopList.create({ salesId: salesId, username: username })
        res.status(200).json(stopList)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { salesId, username } = req.body;
    try {
        const stopList = await StopList.update({ salesId: salesId, username: username }, { where: { id } });
        res.status(200).json(stopList);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        await StopList.destroy({ where: { id } })
        res.status(200).json({ message: "Stop list deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router