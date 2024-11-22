const express = require('express')
const app = express()
const db = require('./config/database')
const routers = require('./routers')
const cors = require('cors')
const path = require('path');
const bodyParser = require('body-parser')
const Agent = require('./models/agent')

// const allowedOrigins = ['http://localhost:3000', 'http://localhost:3002'];

// app.use(cors({
//     origin: (origin, callback) => {
//         if (allowedOrigins.includes(origin) || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
// }))

app.use(cors())

app.use('/public', express.static(path.resolve(__dirname, '..', 'public')));

app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', 'public/uploads', filename);
    res.sendFile(filepath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('File not found');
        }
    });
});

app.use(express.json())
app.use('/api', routers)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// async function resetAgentPoints() {
//     try {
//         await Agent.update(
//             { usd: 0, eur: 0, gbp: 0 },
//             { where: {} }
//         );
//         console.log("All agent points reset to 0.");
//     } catch (error) {
//         console.error("Failed to reset agent points:", error);
//     }
// }

db.authenticate()
    .then(async() => {
        console.log("Database connected...")

        // await resetAgentPoints();
    })
    .catch(err => console.error("Error connection to the database", err))

db.sync()

module.exports = app