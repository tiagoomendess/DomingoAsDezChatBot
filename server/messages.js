const bodyParser = require('body-parser');
const express = require('express');

function MessegesRouter() {

  let router = express();

  router.use(bodyParser.json({ limit: '100mb' }));
  router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  router.route('/received')
    .post(function (req, res, next) {
      console.log('Message Received!');
      res.status(200);
      res.send("Ok");
      next();
    });

  return router;
}

module.exports = MessegesRouter;