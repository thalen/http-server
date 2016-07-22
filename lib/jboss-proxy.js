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

function doRequest(req, method, callback) {
  var url_parts = url.parse(req.url);

  var headersParam = {};
  var params = argv.headers.split(',');
  params.forEach(function (value) {
    headersParam[value] = req.get(value);
  });
  if (method === 'GET') {
    request({
      url: argv.host + url_parts.pathname,
      method: method,
      headers: headersParam
    }, callback);
  } else {
    headersParam['content-type'] = 'application/x-www-form-urlencoded';
    request({
      url: argv.host + url_parts.pathname,
      method: method,
      headers: headersParam,
      body: req.body
    }, callback);
  }
}

router.get('/*', function(req, res) {
    doRequest(req, 'GET', function (error, response, body) {
      if(error) {
        res.status(500).send({
          error: error
        });
      } else {
        res.send(body);
      }
    });
});

router.put('/*', function(req, res) {
    doRequest(req, 'PUT', function (error, response, body) {
      if(error) {
        res.status(500).send({
          error: error
        });
      } else {
        res.send(body);
      }
    });
});

router.delete('/*', function(req, res) {
    doRequest(req, 'DELETE', function (error, response, body) {
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
