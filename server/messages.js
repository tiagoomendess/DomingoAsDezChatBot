const bodyParser = require('body-parser');
const express = require('express');

function MessegesRouter() {

  let router = express();

  router.use(bodyParser.json({ limit: '100mb' }));
  router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  router.route('/received')

    .get(function(req, res, next) {
        console.log('GET /messages/received');
        res.status(200);
        res.send("Ok");
    })
    
    .post(function (req, res, next) {
        console.log('POST /messages/received');
        res.status(200);
        res.send("Ok");
      next();
    });

  return router;
}

module.exports = MessegesRouter;