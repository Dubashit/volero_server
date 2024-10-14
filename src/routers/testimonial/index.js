const router = require('express').Router();
const { Op } = require('sequelize');
const Testimonial = require('../../models/testimonial');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

router.get('/search', async (req, res) => {
    const { author, position, countOfStars } = req.query;
    try {
        const whereClause = {};
        if (author) {
            whereClause.author = {
                [Op.iLike]: `%${author}%`
            };
        }
        if (position) {
            whereClause.position = {
                [Op.iLike]: `%${position}%`
            };
        }
        if (countOfStars) {
            whereClause.countOfStars = {
                [Op.eq]: Number(countOfStars)
            };
        }
        const testimonials = await Testimonial.findAll({
            where: whereClause
        });
        res.json(testimonials);
    } catch (error) {
        console.error('Error fetching coefficients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll();
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const testimonial = await Testimonial.findOne({ where: { id } });
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/testimonials');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|web/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Only image files are allowed (JPEG, JPG, PNG, GIF, WEB)!');
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter,
});

router.post('/', upload.single('image'), async (req, res) => {
    const { comment, author, position, countOfStars } = req.body;

    const filePath = `/testimonials/${req.file.filename}`;

    try {
        const testimonial = await Testimonial.create({
            comment,
            author,
            position,
            image: filePath,
            countOfStars
        });
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const { author, position, comment, countOfStars, oldImage } = req.body;
    try {
        if (req.file && oldImage) {
            const oldFilePath = path.join(__dirname, '../../../public', oldImage);
            fs.unlink(oldFilePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error(`Error deleting old preview file: ${oldFilePath}`, err);
                } else {
                    console.log(`Successfully deleted old preview file: ${oldFilePath}`);
                }
            });
        }

        const previewPath = req.file ? `/testimonials/${req.file.filename}` : oldImage;

        let updatedData = {
            comment,
            author,
            position,
            countOfStars,
            image: previewPath
        }

        console.log('Updating testimonial with data:', updatedData);

        const [updated] = await Testimonial.update(updatedData, { where: { id } });

        if (updated) {
            const updatedTestimonial = await Testimonial.findOne({ where: { id } });
            res.status(200).json({ message: 'Testimonial updated successfully', updatedTestimonial });
        } else {
            res.status(404).json({ error: 'Testimonial not found' });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const testimonial = await Testimonial.findOne({ where: { id } })
        if (!testimonial) {
            return res.status(404).json({ error: "Testimonial not found" });
        }
        if (testimonial.image) {
            const filePath = path.join(__dirname, '../../../public', testimonial.image);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting image: ${filePath}`, err);
                } else {
                    console.log(`Successfully deleted image: ${filePath}`);
                }
            });
        }
        await Testimonial.destroy({ where: { id } });
        res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
