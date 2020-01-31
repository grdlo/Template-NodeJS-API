/** npm package - go at http://npmjs.org/ for more information about each package */
const config = require('config');
const mongoose = require('mongoose');

/** custom import */
const { setupApp } = require('./services/express');
const seedHelper = require('./helpers/seed');

const MONGODB_URI = config.get('database.uri');
const app = setupApp();

mongoose.set('debug', config.get('mongo.debug'));
/** Connecting mongodb service */
mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(async () => {
        /** Seeding database with first admin account */
        await seedHelper.seedDatabase();
        /** Starting API */
        app.listen(config.get('app.port'), () => {
            console.log('API listening on port :', config.get('app.port'));
        });
    })
    .catch(error => {
        /** Stoping API, database connexion impossible */
        console.log('Fail to connect to MongoDB :', error);
        process.exit(1);
    });
