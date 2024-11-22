const router = require('express').Router();
const { Op } = require('sequelize');
const GlobalSetting = require('../../models/globalSetting');
const schedule = require("node-schedule");

// router.get('/', async (req, res) => {
//     const { title } = req.query;
//     try {
//         let tags;
//         if (title) {
//             tags = await Tag.findAll({ where: { title: { [Op.iLike]: `%${title}%` } } });
//         } else {
//             tags = await Tag.findAll();
//         }
//         res.status(200).json(tags);
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

router.get('/', async (req, res) => {
    try {
        const globalSettings = await GlobalSetting.findOne();
        res.status(200).json(globalSettings);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

const defaultValues = { percentage: "0.5", days: "1" };

const resetGlobalSetting = async () => {
    try {
        const existingGlobalSetting = await GlobalSetting.findOne();

        if (existingGlobalSetting) {
            await existingGlobalSetting.update(defaultValues);
            console.log("GlobalSetting reset to default values");
        }
    } catch (error) {
        console.error("Error resetting GlobalSetting:", error);
    }
};

const scheduleReset = (days) => {
    const resetDate = new Date();
    resetDate.setDate(resetDate.getDate() + parseInt(days));

    schedule.scheduleJob(resetDate, resetGlobalSetting);
    console.log(`Reset scheduled for ${resetDate}`);
};

router.post('/', async (req, res) => {
    const { percentage, days } = req.body
    try {
        const existingGlobalSetting = await GlobalSetting.findOne();

        if (existingGlobalSetting) {
            await existingGlobalSetting.update({ percentage, days });
            scheduleReset(days);
            res.status(200).json(existingGlobalSetting);
        } else {
            const globalSetting = await GlobalSetting.create({ percentage, days });
            scheduleReset(days);
            res.status(201).json(globalSetting);
        }
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
