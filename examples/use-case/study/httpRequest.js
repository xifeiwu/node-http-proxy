const http = require('http');

class Request {
  constructor() {}

  request() {
    const payload1 = {
      port: '30334',
      host: '10.10.202.143:30334',
      hostname: '10.10.202.143',
      socketPath: undefined,
      pfx: undefined,
      key: undefined,
      passphrase: undefined,
      cert: undefined,
      ca: undefined,
      ciphers: undefined,
      secureProtocol: undefined,
      method: 'GET',
      headers:
       { host: '10.10.202.143:30334',
         // connection: 'keep-alive',
         connection: 'close',
         'cache-control': 'max-age=0',
         'upgrade-insecure-requests': '1',
         'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
         accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
         'accept-encoding': 'gzip, deflate, br',
         'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,und;q=0.7' },
      agent: false,
      localAddress: undefined,
      path: '/' 
    };

    const payload2 = {
      port: '30334',
      host: '10.10.202.143:30334',
      hostname: '10.10.202.143',
      socketPath: undefined,
      pfx: undefined,
      key: undefined,
      passphrase: undefined,
      cert: undefined,
      ca: undefined,
      ciphers: undefined,
      secureProtocol: undefined,
      method: 'GET',
      headers:
       { cookie: 'show=true; view=10; user=eyJ2aXNpdENvdW50IjoxMSwiX2V4cGlyZSI6MTU0OTAxMzMxMTI3NiwiX21heEFnZSI6ODY0MDAwMDB9; JSESSIONID=4894CA22E5E1626DBB940F27EC469764; foo=bar; bar=baz; __utmc=96992031; __utmz=96992031.1553771796.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utma=96992031.547024646.1553771796.1555991692.1556097330.3',
         'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,und;q=0.7',
         'accept-encoding': 'gzip, deflate, br',
         accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
         'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
         'upgrade-insecure-requests': '1',
         'cache-control': 'max-age=0',
         connection: 'close',
         host: '10.10.202.143:30334' },
      agent: false,
      localAddress: undefined,
      path: '/createRandomImage' 
    };

    const request = http.request(payload2);
    request.on('response', res => {
      var str = '';
      console.log('Response is ' + res.statusCode);
      console.log(res.headers);
      res.on('data', function(chunk) {
        console.log(chunk.toString());
        str += chunk;
      });
      res.on('end', function() {
        // console.log(str.toString());
      });
    });
    // request.end();
  }
}

const obj = new Request();
obj.request();

setTimeout(() => {}, 5000);