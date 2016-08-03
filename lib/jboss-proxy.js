var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request = require('request');
var url = require('url');
var argv = require('optimist')
  .boolean('cors')
  .argv;
var morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

var router = express.Router();
var requestHandler = function (requestType) {
    return function (req, res) {
      doRequest(req, requestType, function (error, response, body) {
        res.send(body);        
      });
    };
};

function doRequest(req, method, callback) {
  var url_parts = url.parse(req.url);

  var headersParam = {};
  var params = argv.headers.split(',');
  params.forEach(function (value) {
    headersParam[value] = req.get(value);
  });
  if (method === 'GET') {
    request({
      url: argv.host + url_parts.path,
      method: method,
      headers: headersParam
    }, callback);
  } else {
    headersParam['content-type'] = 'application/x-www-form-urlencoded';
    request({
      url: argv.host + url_parts.path,
      method: method,
      headers: headersParam,
      body: req.body
    }, callback);
  }
}
router.get('/*', requestHandler('GET'));
router.put('/*', requestHandler('PUT'));
router.post('/*', requestHandler('POST'));
router.delete('/*', requestHandler('DELETE'));

app.use('/rest', router);

var port = argv.p;
// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Now I'm restful on port " + port);
console.log("arguments", JSON.stringify(argv, null, 2));
