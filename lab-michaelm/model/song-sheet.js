'use strict';

const mongoose = require('mongoose');
const {S3} = require('aws-sdk');
const s3 = new S3();

const songSheetSchema = mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  title: {type: String, required: true, minlength: 1},
  content: {type: String, required: true, minlength: 1},
  songSheetURI: {type: String, required: true, minlength: 1},
});

songSheetSchema.pre('remove', function(next){
  let Key = this.songSheetURI.split('/').pop() ;
  if(!Key)
    return next(new Error('unable to delete s3 object'));

  s3.deleteObject({
    Key,
    Bucket: process.env.AWS_BUCKET,
  })
    .promise()
    .then(() => next())
    .catch(next);
});

module.exports = mongoose.model('song-sheet', songSheetSchema);
