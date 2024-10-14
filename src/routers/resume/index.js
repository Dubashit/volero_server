const router = require('express').Router();
const { Op } = require('sequelize');
const Resume = require('../../models/resume');
const multer = require('multer');
const path = require('path');
const fs = require('fs')

router.get('/search', async (req, res) => {
    try {
        const { name, startDate, endDate } = req.query;
        const whereClause = {};
        if (name) {
            whereClause.name = {
                [Op.iLike]: `%${name}%`,
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
        const resume = await Resume.findAll({
            where: whereClause
        });
        res.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const resume = await Resume.findAll();
        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const resume = await Resume.findOne({ where: { id } });
        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const resume = await Resume.findOne({ where: { id } });

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        if (resume.cv) {
            console.log(resume.cv);
            
            const filePath = path.join(__dirname, '../../../public', resume.cv);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${filePath}`, err);
                } else {
                    console.log(`Successfully deleted file: ${filePath}`);
                }
            });
        }

        await Resume.destroy({ where: { id } });
        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        console.error('Error deleting Resume:', error);
        res.status(400).json({ error: error.message });
    }
});

// download file in /public/uploads

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /doc|docx|pdf/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Files of type DOC, DOCX, or PDF only!');
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
});

router.post('/', upload.single('cv'), async (req, res) => {
    try {
        const { name, email, countryCode, phone, city, linkedIn, source, vacancy } = req.body;
        const filePath = `/uploads/${req.file.filename}`;
        console.log(filePath);

        const resume = await Resume.create({
            name,
            email,
            countryCode,
            phone,
            vacancy,
            city,
            linkedIn,
            source,
            cv: filePath
        });

        res.status(200).json({
            message: 'Resume and file saved successfully!',
            resume,
        });
    } catch (error) {
        console.error('Error saving resume:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
