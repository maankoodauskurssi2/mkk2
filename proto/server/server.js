var express = require('express'),
  //  morgan = require('morgan'),  
    proxy = require('./node_modules/json-proxy/lib/proxy'),
    cors = require('cors');

var app = express();

//app.use(morgan('dev'));
app.use(cors())
app.use(proxy.initialize({
  proxy: {
    'forward': {
      '/': 'https://ibm-watson-ml.mybluemix.net/score/Config3?accesskey=nGCS2Ryw7UJlHKNQ25Qlan9mntJ7Yh7tCNhnWeiSjVZOAXxhbbjJ24DtKRbQINGSHxGxQ3pIogjgEOjN0TGDTcL0h32gVzPkwMbmHXNpi+FQYUqQmv73SQJrb1WXWeZv'
    }
  }
}));

app.use(express.static(__dirname));

var port = process.env.PORT || 5000;
app.listen(port);
console.log('listening on http://localhost:'+port);