/*eslint-disable */
/* eslint no-console: 0 */
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');
const http = require('http');
const fs = require('fs')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

const server = require("http").Server(app);


function requestGeoServer(req, res) {
    // console.log(req)
    
    const path = req.originalUrl;//req._parsedUrl.query;
    try {
        const file = fs.readFileSync('./server/tmp/' + path.replace(/\//g, '#'), 'utf-8');
        res.end(file);
        // console.log(file)
    } catch (e) {
        var url = 'http://localhost:8080' + req.originalUrl//req._parsedUrl.query
        console.log(url)
        var proxy = http.request(url, function (r) {
            var data = ''
            console.log('in')
            r.on('data', function (d) {
                data += d;
            }).on('end', () => {
                console.log('write')
                fs.writeFile('./server/tmp/' + path.replace(/\//g, '#'), data, ()=>{});
                res.end(data);
            });

        }).on('error', function (e) {
            console.log("Got error: " + e.message);
        })
        proxy.end();
    }


}


app.all('/geoserver*', requestGeoServer)



server.listen(8088, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
