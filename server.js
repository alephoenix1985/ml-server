var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;        // set our port

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

var apiRoutes = require('./app/routes');

// ROUTES
app.use('/api', apiRoutes);

// START THE SERVER
app.listen(port);
console.log('Server For Practical test ' + port);