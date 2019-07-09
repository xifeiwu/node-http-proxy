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

proxy.on('proxyRes', (proxyRes, req, res) => {
  if (ignoreUrl(req.url)) {
    return;
  }
  proxyRes.on('data', data => {
    console.log(`data of: ${req.url}`);
    // console.log(data);
    console.log(data.toString());
  });
  proxyRes.on('end', () => {
    console.log(`end of: ${req.url}`);
  })
});
proxy.on('end', (req, res, proxyRes) => {
  console.log(`proxy end: ${req.url}`);
});

function ignoreUrl(url) {
  const whiteList = [];
  const blackList = ['/favicon.ico'];
  var hanldUrl = false;
  if (whiteList && whiteList.length > 0) {
    hanldUrl = whiteList.indexOf(url) > -1;
  } else {
    hanldUrl = !(blackList.indexOf(url) > -1);
  }
  return !hanldUrl;
}
function preTreadReq(req) {
  const headers = req.headers;
  ['if-none-match'].forEach(key => {
    headers.hasOwnProperty(key) && (delete headers[key])
    headers.hasOwnProperty(key.toUpperCase()) && (delete headers[key.toUpperCase()])
  })
}

var server = http.createServer(function (req, res) {
  preTreadReq(req);
  console.log('request for:' + req.url);
  proxy.web(req, res, {
    // target: 'http://10.10.202.143:30334',
    target: 'http://127.0.0.1:8001',
    changeOrigin: true
  });
}).listen(8888);

console.log(`server started: http://127.0.0.1:8888`);

