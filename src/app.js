const express = require('express')
const app = express()
const db = require('./config/database')
const routers = require('./routers')
const cors = require('cors')
const cron = require('node-cron');
const path = require('path');
const bodyParser = require('body-parser')
const { default: axios } = require('axios')
const Agent = require('./models/agent')
const StopList = require('./models/stopList')
const Coefficient = require('./models/coefficient')
const GlobalSetting = require('./models/globalSetting')
const Booking = require('./models/booking')

const tokenUrl = 'https://volero.net/_test/admin/oauth2/token';
const reservationsUrl = 'https://volero.net/_test/admin/api/reservationsApi/v1/reservations';

const clientId = '4c8eb2ee7d4244feb5b04fab598f6a23';
const clientSecret = '502e6dca653e4e60ae9d4adb2e941eda';

cron.schedule('0 2 * * *', async () => {
    console.log('Running refreshDataInTablesAgentsAndBookings at 00:00');
    try {
        const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'read:reservations',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const accessToken = tokenResponse.data.access_token;
        console.log('Access token received:', accessToken);

        const reservationsResponse = await axios.get(reservationsUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (reservationsResponse.status === 200) {
            console.log('Reservations data received');
            await refreshDataInTablesAgentsAndBookings(reservationsResponse);
            console.log('Data refresh completed successfully');
        } else {
            console.error('Failed to fetch reservations:', reservationsResponse.status);
        }
    } catch (error) {
        console.error('Error running daily task:', error.message);
    }
});

const refreshDataInTablesAgentsAndBookings = async (reservationsResponse) => {
    const reservations = reservationsResponse.data._embedded.reservation;
    try {
        await Promise.all(
            reservations.map(async (reservation) => {
                const agentData = {
                    id: reservation.agent?.id || null,
                    reseller: reservation.reseller?.id || null,
                    salesId: reservation.reseller?.code || null,
                    username: reservation.agent?.username || null,
                    email: reservation.agent?.email || null,
                    name: reservation.agent?.name || null,
                    usd: 0,
                    eur: 0,
                    gbp: 0,
                };

                const bookingData = {
                    id: reservation.id || null,
                    userId: reservation.agent?.id || null,
                    sellingPrice: reservation.service?.prices?.total?.net?.value || null,
                    currency: reservation.service?.prices?.total?.net?.currency || null,
                };

                const [agent, created] = await Agent.findOrCreate({
                    where: { id: agentData.id },
                    defaults: agentData,
                });

                if (created) {
                    console.log('Agent created:', agent);
                } else {
                    console.log('Agent already exists:', agent);
                }

                const existingBooking = await Booking.findOne({ where: { id: bookingData.id } });

                if (existingBooking) {
                    console.log('Booking already exists:', existingBooking);
                    return;
                }

                const stopLists = await StopList.findAll({ where: { salesId: agent.salesId } });
                const stopListWithUsername = stopLists.find(stop => stop.username === agent.username);
                const stopListWithoutUsername = stopLists.find(stop => !stop.username || stop.username === '');

                let pointsCollected = 0

                if (!stopListWithUsername && !stopListWithoutUsername) {
                    const globalCoef = await GlobalSetting.findOne();
                    const coefficient = await Coefficient.findOne({ where: { salesId: agent.salesId } });

                    if (coefficient) {
                        pointsCollected = parseFloat((sellingPrice * coefficient.percentage / 100).toFixed(2));
                    } else if (globalCoef) {
                        pointsCollected = parseFloat((sellingPrice * globalCoef.percentage / 100).toFixed(2));
                    } else {
                        pointsCollected = parseFloat((sellingPrice * 0.005).toFixed(2))
                    }
                }

                const booking = await Booking.create({
                    ...bookingData,
                    pointsCollected,
                });

                let { usd, eur, gbp } = agent;

                switch (bookingData.currency) {
                    case 'USD':
                        usd = parseFloat(usd) + parseFloat(pointsCollected);
                        break;
                    case 'EUR':
                        eur = parseFloat(eur) + parseFloat(pointsCollected);
                        break;
                    case 'GBP':
                        gbp = parseFloat(gbp) + parseFloat(pointsCollected);
                        break;
                    default:
                        throw new Error('Invalid currency');
                }

                await Agent.update(
                    { usd, eur, gbp },
                    { where: { id: agent.id } }
                );

                console.log('Booking created:', booking);
            })
        );
        console.log('All reservations processed successfully');
    } catch (error) {
        console.error('Error processing reservations:', error);
    }
}

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
    .then(async () => {
        console.log("Database connected...")
    })
    .catch(err => console.error("Error connection to the database", err))

db.sync()

module.exports = app