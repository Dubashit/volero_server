const router = require('express').Router();
const { Op } = require('sequelize');
const Tag = require('../../models/tag');

router.get('/', async (req, res) => {
    const { title } = req.query;
    try {
        let tags;
        if (title) {
            tags = await Tag.findAll({ where: { title: { [Op.iLike]: `%${title}%` } } });
        } else {
            tags = await Tag.findAll();
        }
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const tag = await Tag.findOne({ where: { id } });
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/', async (req, res) => {
    const { title } = req.body;
    try {
        const tag = await Tag.create({ title: title });
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { title } = req.body;
    try {
        const tag = await Tag.update({ title: title }, { where: { id } });
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Tag.destroy({ where: { id } });
        res.status(200).json({ message: "Tag deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
