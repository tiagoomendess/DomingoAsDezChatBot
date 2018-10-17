const express = require('express');
let MessagesAPI = require('./server/messages');
let APIIndex = require('./server/api-index');

function initialize() {
  
  let api = express();

  api.use('/', APIIndex());
  api.use('/messages', MessagesAPI());

  return api;
  
}

module.exports = {
  initialize: initialize,
};