const express = require('express');
const http = require('http');
require('dotenv').config()

let router = require('./router');

var app = express();

app.use(function(req, res, next) {
  
    res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type, Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.use(router.initialize());

const server = http.Server(app);

server.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}/`);
});