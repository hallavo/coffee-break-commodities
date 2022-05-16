// app.js
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// api.js for the routes
const api = require('./api');

// express app object
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // set views dir to 'CWD/views'
app.set('view engine', 'ejs');

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// all routes are falling back into api.js
app.use('/', api);

// HTTP port setting
const port = process.env.PORT || '3000';
app.set('port', port);

// HTTP server creation
const server = http.createServer(app);

// listening all incoming requests on the set port
server.listen(port, () => console.log(`backend running on port:${port}`));
