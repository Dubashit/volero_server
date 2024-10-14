const router = require('express').Router()
const { Op } = require('sequelize');
const Article = require('../../models/article')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

        const articles = await Article.findAll({
            where: whereClause
        });

        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/', async (req, res) => {
    try {
        const articles = await Article.findAll()
        res.status(200).json(articles)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const article = await Article.findOne({ where: { id } })
        res.status(200).json(article)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/except/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const articles = await Article.findAll({
            where: {
                id: {
                    [Op.ne]: id
                }
            }
        });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const article = await Article.findOne({ where: { id } });

        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        if (article.preview) {
            console.log(article.preview);

            const filePath = path.join(__dirname, '../../../public', article.preview);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${filePath}`, err);
                } else {
                    console.log(`Successfully deleted file: ${filePath}`);
                }
            });
        }

        await Article.destroy({ where: { id } });
        res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(400).json({ error: error.message });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/previews');
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

router.post('/', upload.single('preview'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File is required' });
        }

        const {
            title,
            author,
            tags,
            seoUrl,
            seoTitle,
            seoDescription,
            relatedArticles,
            body,
            status,
            readTime,
        } = req.body;

        const tagsArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
        const relatedArticlesArray = typeof relatedArticles === 'string' ? JSON.parse(relatedArticles) : relatedArticles;
        const filePath = `/previews/${req.file.filename}`;

        const article = await Article.create({
            title,
            author,
            tags: tagsArray,
            seoUrl,
            seoTitle,
            seoDescription,
            relatedArticles: relatedArticlesArray,
            body,
            preview: filePath,
            status,
            readTime,
        });

        res.status(200).json({
            message: 'Article and preview saved successfully!',
            article,
        });
    } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', upload.single('preview'), async (req, res) => {
    const id = req.params.id;
    const { title, author, tags, seoUrl, seoTitle, seoDescription, relatedArticles, body, status, readTime, oldPreview } = req.body;

    try {
        // Проверка на наличие новой картинки и удаление старой, если она существует
        if (req.file && oldPreview) {
            const oldFilePath = path.join(__dirname, '../../../public', oldPreview);
            fs.unlink(oldFilePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error(`Error deleting old preview file: ${oldFilePath}`, err);
                } else {
                    console.log(`Successfully deleted old preview file: ${oldFilePath}`);
                }
            });
        }

        // Новый путь к превью, если файл был загружен
        const previewPath = req.file ? `/previews/${req.file.filename}` : oldPreview;

        let updatedData = {
            title,
            author,
            seoUrl,
            seoTitle,
            seoDescription,
            body,
            status,
            readTime,
            preview: previewPath,
        };

        // Парсим массивы тегов и связанных статей
        updatedData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        updatedData.relatedArticles = typeof relatedArticles === 'string' ? JSON.parse(relatedArticles) : relatedArticles;

        console.log('Updating article with data:', updatedData);

        const [updated] = await Article.update(updatedData, { where: { id } });

        if (updated) {
            const updatedArticle = await Article.findOne({ where: { id } });
            res.status(200).json({ message: 'Article updated successfully', article: updatedArticle });
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: "Internal server error!!!!!" });
    }
});



module.exports = router