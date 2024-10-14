const router = require('express').Router();
const { Op } = require('sequelize');
const RequestRegister = require('../../models/requestRegister');

router.get('/search', async (req, res) => {
    try {
        const { firstName, lastName, startDate, endDate } = req.query;
        const whereClause = {};
        if (firstName) {
            whereClause.firstName = {
                [Op.iLike]: `%${firstName}%`,
            };
        }
        if (lastName) {
            whereClause.lastName = {
                [Op.iLike]: `%${lastName}%`,
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
        const requestsRegister = await RequestRegister.findAll({
            where: whereClause
        });
        res.json(requestsRegister);
    } catch (error) {
        console.error('Error fetching register requests:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const requestsRegister = await RequestRegister.findAll();
        res.status(200).json(requestsRegister);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const requestRegister = await RequestRegister.findOne({ where: { id } });
        res.status(200).json(requestRegister);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await RequestRegister.destroy({ where: { id } });
        res.status(200).json({ message: "Request register deleted successfully" });
    } catch (error) {
        console.error('Error deleting request register:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, countryCode, companyName, companyType, role, country, source, reason } = req.body
        const requestRegister = await RequestRegister.create({
            firstName,
            lastName,
            email,
            countryCode,
            phone,
            companyName,
            companyType,
            role,
            country,
            source,
            reason
        });

        res.status(200).json(requestRegister);
    } catch (error) {
        console.error('Error saving request register:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
