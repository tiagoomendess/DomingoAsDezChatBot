const bodyParser = require('body-parser');
const express = require('express');

function ApiIndexRouter() {

  let router = express();

  router.use(bodyParser.json({ limit: '100mb' }));
  router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  router.route('/')
    .get(function (req, res, next) {
      res.status(200);
      res.send("Domingo às Dez Chat BOT \n I know what you are trying to do!");
      next();
    });

  return router;
  
}

module.exports = ApiIndexRouter;