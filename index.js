const https = require('https');
const fs = require('fs');
const app = require('./src/app');
const selfsigned = require('selfsigned');

const PORT = process.env.PORT;

const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

if (process.env.ENV === "dev") {
    app.listen(PORT, ()=>{
        console.log(`DEV server running on port ${PORT}`)
    })
} else if (process.env.ENV === "prod") {
    fs.writeFileSync('server.key', pems.private);
    fs.writeFileSync('server.cert', pems.cert);

    const sslOptions = {
        key: pems.private,
        cert: pems.cert
    };

    https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`PROD server running on port ${PORT}`);
    });
}