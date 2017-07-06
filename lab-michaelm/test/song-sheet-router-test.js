'use strict';

// load env
require('dotenv').config({path: `${__dirname}/../.test.env`});

// require npm modules;
const expect = require('expect');
const superagent = require('superagent');

// require app modules
const server = require('../lib/server.js');
const clearDB = require('./lib/clear-db.js');
const mockUser = require('./model/mock-user.js');

const API_URL = process.env.API_URL;

describe('---------------------Testing song-sheet router---------------------', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('testing POST /api/resource', () => {
    it('should respond with a song sheet', () => {
      let tempUserData ;
      return mockUser.createOne()
        .then(userData => {
          tempUserData = userData;
          return superagent.post(`${API_URL}/api/resource`)
            .set('Authorization', `Bearer ${tempUserData.token}`)
            .field('title', 'example title')
            .field('content', 'cool beans')
            .attach('file', `${__dirname}/assets/testsheet.docx`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.content).toEqual('cool beans');
          expect(res.body.title).toEqual('example title');
          expect(res.body.userID).toEqual(tempUserData.user._id.toString());
          expect(res.body.songSheetURI).toExist();
        });
    });

    it('should respond with a 400 status code', () => {
      let tempUserData ;
      return mockUser.createOne()
        .then(userData => {
          tempUserData = userData;
          return superagent.post(`${API_URL}/api/resource`)
            .set('Authorization', `Bearer ${tempUserData.token}`)
            .field('title', 'example title')
            .field('content', 'cool beans');
        })
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    it('Should respond with a 401 status code', () => {
      let tempUser;
      return mockUser.createOne()
        .then(userData => {
          tempUser = userData.user;
          let encoded = new Buffer(`${tempUser.username}:bleh`).toString('base64');
          return superagent.post(`${API_URL}/api/resource`)
            .set(`Authorization`, `Basic ${encoded}`);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });

});
