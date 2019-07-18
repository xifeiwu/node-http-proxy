/*
  reverse-proxy.js: Example of reverse proxying (with HTTPS support)
  Copyright (c) 2015 Alberto Pose <albertopose@gmail.com>
  
  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:
  
  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var http = require('http'),
    net = require('net'),
    httpProxy = require('../..'),
    url = require('url'),
    util = require('util');

var proxy = httpProxy.createServer();

const proxyOptions = {
  target: 'http://10.10.202.143:30334',
  changeOrigin: true
}
const pathRewrite = path => path.replace('\/j-api\/paas', '');

var server = http.createServer(function (req, res) {
  util.puts('Receiving reverse proxy request for:' + req.url);
  const urlDesc = url.parse(req.url);

  if (req.url.startsWith('/j-api/paas/')) {
    req.url = pathRewrite(req.url);
    proxy.web(req, res, proxyOptions);
  } else {
    res.statusCode = 200;
    res.end(util.inspect(urlDesc));
  }
}).listen(6006);

server.on('connect', function (req, socket) {
  util.puts('Receiving reverse proxy request for:' + req.url);

  var serverUrl = url.parse('https://' + req.url);

  var srvSocket = net.connect(serverUrl.port, serverUrl.hostname, function() {
    socket.write('HTTP/1.1 200 Connection Established\r\n' +
    'Proxy-agent: Node-Proxy\r\n' +
    '\r\n');
    srvSocket.pipe(socket);
    socket.pipe(srvSocket);
  });
});

// Test with:
// curl -vv -x http://127.0.0.1:8213 https://www.google.com
// curl -vv -x http://127.0.0.1:8213 http://www.google.com