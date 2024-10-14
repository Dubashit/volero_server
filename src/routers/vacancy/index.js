const router = require('express').Router();
const { Op } = require('sequelize');
const Vacancy = require('../../models/vacancy');

router.get('/search', async (req, res) => {
    const { title, status } = req.query;
    try {
        const whereClause = {};
        if (title) {
            whereClause.title = {
                [Op.iLike]: `%${title}%`
            };
        }
        if (status) {
            whereClause.status = {
                [Op.iLike]: `%${status}%`
            };
        }
        const vacancies = await Vacancy.findAll({
            where: whereClause
        });
        res.status(200).json(vacancies);
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const vacancies = await Vacancy.findAll();
        res.status(200).json(vacancies);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const vacancy = await Vacancy.findOne({ where: { id } });
        res.status(200).json(vacancy);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/', async (req, res) => {
    const { title, status, seoUrl, seoTitle, seoDescription, body, location, employmentType } = req.body;
    try {
        const vacancy = await Vacancy.create({
            title: title,
            status: status,
            seoUrl: seoUrl,
            seoTitle: seoTitle,
            seoDescription: seoDescription,
            body: body,
            location: location,
            employmentType: employmentType
        });
        res.status(200).json(vacancy);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { title, status, seoUrl, seoTitle, seoDescription, body, location, employmentType } = req.body;
    try {
        const vacancy = await Vacancy.update({
            title: title,
            status: status,
            seoUrl: seoUrl,
            seoTitle: seoTitle,
            seoDescription: seoDescription,
            body: body,
            location: location,
            employmentType: employmentType
        }, { where: { id } });
        res.status(200).json(vacancy);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Vacancy.destroy({ where: { id } });
        res.status(200).json({ message: "Vacancy deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
