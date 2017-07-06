'use strict';

// npm modules
const {Router} = require('express');
const jsonParser = require('body-parser').json();

// app modules
const basicAuth = require('../lib/auth-middleware.js');
const User = require('../model/user.js');

// module logic
const authRouter = module.exports = new Router();

authRouter.post('/api/signup', jsonParser, (req, res, next) => {
  if(!req.body.password || !req.body.username){
    return next(new Error('Invalid body'));
  }
  User.create(req.body)
  .then(token => res.send(token))
  .catch(next);
});

authRouter.get('/api/login', basicAuth, (req, res, next) => {

  req.user.tokenCreate()
  .then(token => res.send(token))
  .catch(next);
});
