const url = require('url');
const http = require('http');

const proxyOptions = {
  target: 'http://10.10.202.143:30334',
  changeOrigin: true
}
const pathRewrite = path => path.replace('\/j-api\/paas', '');

var server = http.createServer(function (req, res) {
  console.log('Receiving reverse proxy request for:' + req.url);
  const urlDesc = url.parse(req.url);

  if (req.url.startsWith('/j-api/paas/')) {
    req.url = pathRewrite(req.url);
    proxy.web(req, res, proxyOptions);
  } else {
    res.statusCode = 200;
    res.end('default page');
  }
}).listen(6008);


class Proxy {
  constructor() {}
  urlJoin() {
    //
    // We do not want to mess with the query string. All we want to touch is the path.
    //
    var args = Array.prototype.slice.call(arguments),
        lastIndex = args.length - 1,
        last = args[lastIndex],
        lastSegs = last.split('?'),
        retSegs;

    args[lastIndex] = lastSegs.shift();

    //
    // Join all strings, but remove empty strings so we don't get extra slashes from
    // joining e.g. ['', 'am']
    //
    retSegs = [
      args.filter(Boolean).join('/')
          .replace(/\/+/g, '/')
          .replace('http:/', 'http://')
          .replace('https:/', 'https://')
    ];

    // Only join the query string if it exists so we don't have trailing a '?'
    // on every request

    // Handle case where there could be multiple ? in the URL.
    retSegs.push.apply(retSegs, lastSegs);

    return retSegs.join('?')
  }
  setupOutgoing(outgoing, options, req) {
    outgoing.port = options['target'].port;

    ['host', 'hostname', 'socketPath', 'pfx', 'key',
      'passphrase', 'cert', 'ca', 'ciphers', 'secureProtocol'].forEach(
      function(e) { outgoing[e] = options['target'][e]; }
    );

    outgoing.method = options.method || req.method;
    outgoing.headers = Object.assign({}, req.headers);

    if (options.headers){
      Object.assign(outgoing.headers, options.headers);
    }

    if (options.auth) {
      outgoing.auth = options.auth;
    }
    
    if (options.ca) {
        outgoing.ca = options.ca;
    }

    outgoing.agent = options.agent || false;
    outgoing.localAddress = options.localAddress;

    //
    // Remark: If we are false and not upgrading, set the connection: close. This is the right thing to do
    // as node core doesn't handle this COMPLETELY properly yet.
    //
    // if (!outgoing.agent) {
    //   outgoing.headers = outgoing.headers || {};
    //   if (typeof outgoing.headers.connection !== 'string'
    //       || !upgradeHeader.test(outgoing.headers.connection)
    //      ) { outgoing.headers.connection = 'close'; }
    // }


    // the final path is target path + relative path requested by user:
    var target = options['target'];
    var targetPath = target && options.prependPath !== false
      ? (target.path || '')
      : '';

    //
    // Remark: Can we somehow not use url.parse as a perf optimization?
    //
    var outgoingPath = !options.toProxy
      ? (url.parse(req.url).path || '')
      : req.url;

    //
    // Remark: ignorePath will just straight up ignore whatever the request's
    // path is. This can be labeled as FOOT-GUN material if you do not know what
    // you are doing and are using conflicting options.
    //
    outgoingPath = !options.ignorePath ? outgoingPath : '';

    outgoing.path = this.urlJoin(targetPath, outgoingPath);

    console.log(outgoing.headers.host);
    if (options.changeOrigin) {
      outgoing.headers.host =
        // required(outgoing.port, options['target'].protocol) && !hasPort(outgoing.host)
        false
          ? outgoing.host + ':' + outgoing.port
          : outgoing.host;
    }
    return outgoing;
  }
  stream(req, res, options) {
    const outGoing = this.setupOutgoing({}, options, req);
    console.log('outGoing');
    console.log(outGoing);

    const proxyReq = http.request(outGoing);
    req.pipe(proxyReq);
    proxyReq.on('response', (proxyRes) => {
      this.postTreat(req, res, proxyRes);

      proxyRes.pipe(res);
    });
    proxyReq.on('data', d => {
      console.log(d);
    });
    // res.end('end');
  }
  web(req, res, options) {
    options.target = url.parse(options.target);
    this.stream(req, res, options);
  }

  postTreat(req, res, proxyRes) {
    Object.keys(proxyRes.headers).forEach(function(key) {
      var header = proxyRes.headers[key];
      // if (preserveHeaderKeyCase && rawHeaderKeyMap) {
        // key = rawHeaderKeyMap[key] || key;
      // }
      res.setHeader(String(key).trim(), header);
    });
  }
}

const proxy = new Proxy();
