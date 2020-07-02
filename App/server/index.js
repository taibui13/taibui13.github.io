var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var clone = require("lodash/cloneDeep");
var busboy = require("connect-busboy");
var baseResponse = {status: "00000", errorDesc: null, errors: null, data: null};
const SUCCESS = "00000";
const ERROR = "00101";
app.use(busboy());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

app.use((req, res, next) => {
    //console.log(req.body);
    next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static("public"));

var user = require("./json/user/index.json");

app.get("/rewards/api/v1/offers/123456789", function (req, res) {
    var body = req.body || {};
    //var data =  offer;
    var data =  user;
    setTimeout(function() {
        return res.status(200).end(JSON.stringify(data));
    }, 100);
});
app.get("/users", function (req, res) {
    var body = req.body || {};
    //var data =  offer;
    var data =  user;
    setTimeout(function() {
        return res.status(200).end(JSON.stringify(data));
    }, 100);
});


var server = app.listen(9090, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Mock REST API listening at http://%s:%s", host, port);
});
