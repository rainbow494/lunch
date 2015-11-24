var http = require('http');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var merge = require('merge');

var apiKey = 'key-ea2e3ab5ee11c200168588fc18acf3a3';
var domain = 'easyrun.hk';
//var apiBaseUrl = 'https://api.mailgun.net/v3/easyrun.hk';

var mailgun = require('mailgun-js')({apiKey: apiKey,domain:domain});
var sendmail = function(prodcutInquire){
    
    var data = {
      from: 'lunch team',
      to: 'rainbow494@qq.com',
      subject: 'lunch team',
      text: ''
    };

    data = merge(data, prodcutInquire);
    data.text = String.format('Mail From {0} {1} : {2}', data.firstName, data.lastName, data.text);
    console.log(data);
    
    mailgun.messages().send(data, function (error, body) {
      console.error(error);
      console.log(body);
    });
    
    var replyMessage = [];
    var customerName = String.format('Dear {0} {1},', data.firstName, data.lastName);
    replyMessage.push(customerName);
    replyMessage.push(" ");
    replyMessage.push("Thank you for your interests on our products.");
    replyMessage.push("Your inquiry is well received. We will send you our feedback in 24 hours.");
    replyMessage.push("In case of urgency & importance, pls call our manger MR. Henry BAO :+0086 18621322288.");
    replyMessage.push(" ");
    replyMessage.push("Thank you for your patience.");
    replyMessage.push(" ");
    replyMessage.push("Your trustworthy,");
    replyMessage.push("Easyrun Sales Team");
     
    var from = data.from;
    var to = data.to;
    data.to = from,
    data.from = to,
    data.text = replyMessage.join('\n\r');
    mailgun.messages().send(data, function (error, body) {
      console.error(error);
      console.log(body);
    });
}

var app = express()
var jsonParser = bodyParser.json();
//var urlencodedParser = bodyParser.urlencoded({ extended: false });

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/api/test', jsonParser , function (req, res) {
    console.log('test');
    res.send('test success')
})

app.post('/api/productinquire', jsonParser , function (req, res) {
    sendmail(req.body.data);
    res.send('Send Mail')
})

app.listen(12333);

String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    s = s.replace(reg, arguments[i + 1]);
  }

  return s;
}