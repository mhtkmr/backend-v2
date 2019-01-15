const dotenv = require('dotenv');
dotenv.config();
const config = require('./config');
const express = require('express');

/**
 * Middlewares declarations
 */
// Handling cors
const cors = require('cors');
// Body parser for req/res
const bodyParser = require('body-parser');
// Nice cool logger (Bunyan)
const logger = require("./logger")();
// Express-session for maintaining sessions
const session = require('express-session');
// Redis client (Async using bluebird)
const client = require('./redis').getClient;

/**
 * Other variables
 */
// Configure isProduction variable
const isProduction = config["env"] === 'production';
// Initialize app
const app = express();

/**
 * Application Middlewares
 */
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(session({
    secret: 'express-session',
    cookie: {
        maxAge: 2000 * 3600 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}));

// ## Configure databases here.
require("./mongo");

/**
 * Routes
 */
app.use("/", require("./routes/auth")({
    client,
    logger
}));

/**
 * Error handlers & middlewares
 */
app.use((err, req, res, next) => {
    logger.error(`[${req.method}][${req.url}] - ${JSON.stringify(err)}`);
    res.status(err.status || 500).json({
        errors: {
            message: err.message,
            error: isProduction ? {} : err,
        },
    });
});

app.listen(config["port"], () => {
    console.log(`Server listening on port: ${config["port"]}`)
});