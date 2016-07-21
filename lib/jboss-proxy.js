var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request = require('request');
var url = require('url');
var argv = require('optimist')
  .boolean('cors')
  .argv;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.get('/*', function(req, res) {
    console.log("got proxied request");
    var url_parts = url.parse(req.url);

    var headersParam = {};
    var params = argv.headers.split(',');
    params.forEach(function (value) {
      headersParam[value] = req.get(value);
    });
    request({
      url: argv.host + url_parts.pathname,
      method: 'GET',
      headers: headersParam
    }, function(error, response, body) {
      if(error) {
        res.status(500).send({
          error: error
        });
      } else {
        res.send(body);
      }
    });
});

app.use('/rest', router);

var port = 8091;
// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Now I'm restful on port " + port);
console.log("arguments", JSON.stringify(argv, null, 2));
