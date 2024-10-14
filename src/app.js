const express = require('express')
const app = express()
const db = require('./config/database')
const routers = require('./routers')
const cors = require('cors')
const path = require('path');
const bodyParser = require('body-parser')

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

db.authenticate()
    .then(()=>console.log("Database connected..."))
    .catch(err=>console.error("Error connection to the database", err))

db.sync()

module.exports = app