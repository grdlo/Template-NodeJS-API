/** npm package - go at http://npmjs.org/ for more information about each package */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

process.env.NODE_ENV = 'test';

before(async () => {
    try {
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getConnectionString();
        await mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Test database uri : ', mongoUri);
    } catch (err) {
        console.debug('Error : ', err);
    }
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

