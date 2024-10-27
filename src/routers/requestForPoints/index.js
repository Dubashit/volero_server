const router = require('express').Router();
const { Op } = require('sequelize');
const RequestForPoints = require('../../models/requestForPoints');

router.get('/search', async (req, res) => {
    try {
        const { username, email, startDate, endDate } = req.query;
        const whereClause = {};
        if (username) {
            whereClause.username = {
                [Op.iLike]: `%${username}%`,
            };
        }
        if (email) {
            whereClause.email = {
                [Op.iLike]: `%${email}%`,
            };
        }
        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            whereClause.createdAt = {
                [Op.gte]: new Date(startDate)
            };
        } else if (endDate) {
            whereClause.createdAt = {
                [Op.lte]: new Date(endDate)
            };
        }
        const requestForPoints = await RequestForPoints.findAll({
            where: whereClause
        });
        res.json(requestForPoints);
    } catch (error) {
        console.error('Error fetching requests for points:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const requestForPoints = await RequestForPoints.findAll();
        res.status(200).json(requestForPoints);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const requestForPoints = await RequestForPoints.findOne({ where: { id } });
        res.status(200).json(requestForPoints);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { username, email, phone, countryCode, message, isDone } = req.body
    try {
        const requestForPoints = await RequestForPoints.update({
            username,
            email,
            countryCode,
            phone,
            message,
            isDone
        }, { where: { id } })

        res.status(200).json(requestForPoints)
    } catch (error) {
        console.error('Error updating request for points:', error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await RequestForPoints.destroy({ where: { id } });
        res.status(200).json({ message: "Request for points deleted successfully" });
    } catch (error) {
        console.error('Error deleting request register:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { username, email, phone, countryCode, message, isDone } = req.body
        const requestForPoints = await RequestForPoints.create({
            username,
            email,
            countryCode,
            phone,
            message,
            isDone
        });

        res.status(200).json(requestForPoints);
    } catch (error) {
        console.error('Error saving request for points:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
