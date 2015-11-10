// NPM
var express = require('express');
var app     = express();
var port    = process.env.PORT || 8080;

var usernames = ['@john_doe', '@audrey_hepburn', '@outlier', '@morello', '@walnut', '@toto_91', '@test', '@mario', '@luigi', '@peach', '@banana'];

app.get('/api/bnf', function(req, res) {
  var item = usernames[Math.floor(Math.random()*usernames.length)];

  res.setHeader('Cache-Control', 'max-age=1');
  res.send(item);
});

console.log('Listening to port ', port);

app.listen(port);
