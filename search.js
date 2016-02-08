var cassandra = require('cassandra-driver');
var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

var ks,tb,row,search;
var client,query;
var resultset,last;
var alast = [];
var lastamout;

app.get('/sendrequest', function ( req, res) {
    ks = 'appcache';
    tb = 'kvcache';
    row = 5;
    search = req.query.Search;
    query = "select * from "+tb+" where token(appname) = token('"+search+"')";

    client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: ks});

    client.execute(query, function(err, result) {
        alast.push(result.rows);
        res.status(200).send(result.rows);
        //console.log(result);
    });
    //console.log(alast);
});//end sendrequest

app.get('/data', function ( req, res) {
    client.execute(query, function(err, result) {
        res.status(200).send(result.rows);
    });
});//end data

app.get('/datacount', function ( req, res) {
    client.execute( query, function(err, result) {
        res.json(result.rowLength);
    });
});//end datacount

app.get('/', function ( req, res) {
    res.sendFile(path.join(__dirname, 'search.html'));
}).listen(5555);
