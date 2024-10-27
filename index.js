const https = require('https');
const fs = require('fs');
const app = require('./src/app');

const PORT = process.env.PORT;

const sslOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
});