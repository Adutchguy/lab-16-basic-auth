'use strict';
console.log('Loaded song-sheet-router file');
// npm
const {Router} = require('express');

// app
const s3Upload = require('../lib/s3-upload-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const SongSheet = require('../model/song-sheet.js');

// module  logic
const songSheetRouter = module.exports = new Router();
songSheetRouter.post('/api/songsheet', bearerAuth, s3Upload('file'), (req, res, next) => {

  new SongSheet({
    title: req.body.title,
    content: req.body.content,
    userID: req.user._id.toString(),
    songSheetURI: req.s3Data.Location,
  })
  .save()
  .then(data => res.json(data))
  .catch(next);
});
