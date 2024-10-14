const router = require('express').Router()
const { Op } = require('sequelize');
const Language = require('../../models/language');

router.get('/search', async (req, res) => {
    const { code, title } = req.query;
    try {
        const whereClause = {};
        if (code) {
            whereClause.code = {
                [Op.iLike]: `%${code}%`
            };
        }
        if (title) {
            whereClause.title = {
                [Op.iLike]: `%${title}%`
            };
        }
        const languages = await Language.findAll({
            where: whereClause
        });
        res.json(languages);
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const languages = await Language.findAll()
        res.status(200).json(languages)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const language = await Language.findOne({ where: { id } })
        req.status(200).json(language)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/', async (req, res) => {
    const { code, title } = req.body
    try {
        const language = await Language.create({ code, title })
        res.status(200).json(language)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const { code, title } = req.body
    try {
        const language = await Language.update({ code, title }, { where: { id } })
        res.status(200).json(language)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        await Language.destroy({ where: { id } })
        res.status(200).json({message: "Language deleted successfully"})
    } catch (error) {

    }
})

module.exports = router