// app.js
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const db = require('./db');

// index.js for most routes, auth.js for authentication
const indexRouter = require('./routes/index.js');
const authRouter = require('./routes/auth.js');

// express app object
const app = express();

app.use(logger('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'views')); // set views dir to 'CWD/views'
app.set('view engine', 'ejs');

// static resources served from public/
app.use(express.static(path.join(__dirname, 'public')));

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// authentication-related middleware
app.use(cookieParser());
app.use(session({
  secret: 'nakkimakkara',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  store: new (require('connect-pg-simple')(session))({
    pgPromise: db
  })
}));

// normal routes and authentication are under different routers
app.use('/', indexRouter);
app.use('/', authRouter);

// HTTP port setting
const port = process.env.PORT || '3000';
app.set('port', port);

// HTTP server creation
const server = http.createServer(app);

// listening all incoming requests on the set port
server.listen(port, () => console.log(`backend running on port:${port}`));
