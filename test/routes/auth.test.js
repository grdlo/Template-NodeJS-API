/** npm package - go at http://npmjs.org/ for more information about each package */
const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const request = require('supertest');

/** custom import */
const jwtHelper = require('../../src/helpers/jwt');
const User = require('../../src/models/user');
const { setupApp } = require('../../src/services/express');

let user;
const app = () => setupApp();

describe('Authentification routes - Testing...', () => {

    /** Initialize the databse for test */
    before(async () => {
        const password = await bcrypt.hash('admin', 12);
        user = await User.create({ firstName: 'admin', lastName: 'admin', email: 'admin@admin.com', password, role: 'ADMIN' });
    });

    /** Cleaning the database after test */
    after(async () => {
        const { collections } = mongoose.connection;
        const promises = [];
        /** removing all collections (one by one) */
        Object.keys(collections).forEach((collection) => {
            promises.push(collections[collection].deleteMany());
        });
        await Promise.all(promises);
    });

    it('Testing a successful authentification', async () => {
        /** Creating a test request with SuperTest */
        const { status, body } = await request(app())
            .post('/auth')
            .send({ email: 'admin@admin.com', password: 'admin' });
        /** Testing request body */
        expect(body.user.id).to.equal(user.id);
        /** Testing the JsonWebToken (jwt) content */
        expect((await jwtHelper.verify(body.jwt)).id).to.equal(user.id);
        /** Testing the returned status code */
        expect(status).to.equal(200);
    });

    it('Testing a failed authentification', async () => {
        /** Creating a test request with SuperTest */
        const { status } = await request(app())
            .post('/auth')
            .send({ email: 'user@user.com', password: 'user' });
        /** Testing the returned status code */
        expect(status).to.equal(401);
    });
});
