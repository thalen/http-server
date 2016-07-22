# http-server: a command-line http server

Extended with livereload support using chokidar-socket-emitter. <br>
I also added proxy support for jboss application server.

## Live reload
Enabled by default, use this script to catch events when something changes:

```javascript
var socket = io();
socket.on('change', function(){
  location.reload();
});
```

## jboss-proxy
The proxy solution in http-server does not seem to work when the target is jboss therefore
I've added jboss-proxy.
If you want to proxy some requests, first start http-server like this:

<code>
  node ./bin/http-server path -p portnumber -o --proxy for the jboss-proxy, e.g http://localhost:8090
</code>

Then startup the jboss-proxy, which sends the requests to jboss:

<code>
  npm run jboss-proxy -- --host location of the API, e.g. http://localhost:8080/rest --headers the headers from the original request which you want to send to the target, e.g. my_header1,my_header2
</code>
