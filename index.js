const app = require('./src/app');

const PORT = process.env.PORT;

if (process.env.ENV === "dev") {
    app.listen(PORT, () => {
        console.log(`DEV server running on port ${PORT}`)
    })
} else if (process.env.ENV === "prod") {
    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/xn--voler-yta.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/xn--voler-yta.com/fullchain.pem'),
    };

    app.get('/', (req, res) => {
        res.send('SERVER - HTTPS!');
    });

    https.createServer(options, app).listen(3000, () => {
        console.log('HTTPS server running on https://volero.com:3000');
    });

}