'use strict';

// load test env
require('dotenv').config({path: `${__dirname}/../.test.env`});

// load npm modules
const expect = require('expect');
const superagent = require('superagent');

// load app modules
const server = require('../lib/server.js');
const clearDB = require('./lib/clear-db.js');
const mockUser = require('./model/mock-user.js');

const API_URL = process.env.API_URL;

describe('-----------------testing auth router-----------------', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('testing POST /api/signup', () => {
    it('Should respond with a token', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          username: 'test_user',
          password: 'top secret',
          email: 'test_user@example.lulwat',
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
        });
    });

    it('Should respond with a 400 status code', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          password: 'top secret',
          email: 'test_user@example.lulwat',
        })
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('testing GET /api/login', () => {
    it('Should respond with a token', () => {
      let tempUser;
      return mockUser.createOne()
        .then(userData => {
          tempUser = userData.user;
          let encoded = new Buffer(`${tempUser.username}:${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/login`)
            .set('Authorization', `Basic ${encoded}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
        });
    });

    it('Should respond with a 401 status code', () => {
      let tempUser;
      return mockUser.createOne()
        .then(userData => {
          tempUser = userData.user;
          let encoded = new Buffer(`${tempUser.username}:bleh`).toString('base64');
          return superagent.get(`${API_URL}/api/login`)
            .set(`Authorization`, `Basic ${encoded}`);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });
});
