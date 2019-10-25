import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './app/routes/index.js';
import cors from 'cors';

//
const SERVER = express();

SERVER.use(cors())

// Database Connection
mongoose.connect('mongodb://localhost')
	    .then(() => {
			console.log('Database connection successful');
		})
	    .catch(err => {
			console.error('Database connection error');
		});

// Middleware Filters
SERVER.use(bodyParser.urlencoded({ extended: true }));
SERVER.use(bodyParser.json());

// catch 400
SERVER.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(400).send(`Error: ${res.originUrl} not found`);
    next();
});

// catch 500
SERVER.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send(`Error: ${err}`);
    next();
});

// Register routes
routes(SERVER);

export default SERVER;