'use strict';

const Leader = require('../../model/leader.js');
const Member = require('../../model/member.js');
const User = require('../../model/user.js');
const SongSheet = require('../../model/song-sheet.js');

let removeModelWithHook = (model) => {
  return model.find({})
    .then(items => {
      return Promise.all(items.map(item => item.remove()));
    });
};

module.exports = () => {
  return Promise.all([
    removeModelWithHook(SongSheet),
    Leader.remove({}),
    Member.remove({}),
    User.remove({}),
  ]);
};
