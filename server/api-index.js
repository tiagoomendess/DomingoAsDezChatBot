const bodyParser = require('body-parser');
const express = require('express');

function ApiIndexRouter() {

  let router = express();

  router.use(bodyParser.json({ limit: '100mb' }));
  router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  router.route('/')
    .get(function (req, res, next) {
      res.status(200);
      let message = "<html><head></head><body><h1>Domingo às Dez Chat BOT</h1><small>I know what you are trying to do!</small></body></html>";
      
      res.send(message);
      next();
    });

  return router;
  
}

module.exports = ApiIndexRouter;