var cassandra = require('cassandra-driver');
var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

var ks,tb,row;
var client,query;
var resultset,last;
var alast = [];
var lastamout;

app.get('/sendrequest', function ( req, res) {
    ks = req.query.Keyspace;
    tb = req.query.Table;
    row = req.query.Rows;
    query = 'select * from '+tb;

    console.log("Keyspace :"+ks+" , Table :"+tb);

    client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: ks});
    client.connect( function (err) {
        if (err) {
            console.log('Unable to connect to the Cassandra server. Error:', err);
        } else if(ks != undefined) {
            console.log('Connection established to Cassandra cql : 127.0.0.1:9042');
        }
    });
    res.send("success");
    alast = [];
    calpage(lastamout);
});//end sendrequest

app.get('/data', function ( req, res) {
    if( req.query.cp == 0 )
    {
        client.execute(query+" limit "+req.query.dpp, function(err, result) {
            res.send(result.rows);
            alast[0] = result.rows[req.query.dpp-1];
        });
    }
    else
    {
        console.log(req.query.cp);
        client.execute(query+" where token(appname) > token('"+alast[req.query.cp].appname+"') limit "+req.query.dpp, function(err, result) {
            res.send(result.rows);
            //console.log(result.rows[0]);
            last = result.rows[req.query.dpp-1];
        });
    }
});

app.get('/datacount', function ( req, res) {
    client.execute( query, function(err, result) {
        res.json(result.rowLength);
    });
});

app.get('/', function ( req, res) {
    res.sendFile(path.join(__dirname, 'paging.html'));
});

var server = app.listen(5555, function() {
    console.log('Web is running...');
});

function calpage(lastamout){
    client.execute( query, function(err, result) {
        if(result.rowLength % row == 0)
            lastamout = (result.rowLength / row) - 1;
        else
            lastamout = Math.ceil(result.rowLength / row) - 1;

        for(var i=0; i<= lastamout; i++){
            alast.push( result.rows[row*i-1] );
            console.log(i);
            console.log("keep row "+ (row*i-1) +" : " );
            console.log( result.rows[row*i-1] );
        }
    });
}
