const morgan = require("morgan");
const cors = require("cors");
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const express = require('express')
const app = express();
const sRouter = require('./controllers/entries')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

morgan.token("Data", function (request, ) {
    return JSON.stringify(request.body);
});

app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :Data")
);

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use('/api/persons', sRouter)

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app