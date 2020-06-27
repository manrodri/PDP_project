const express = require('express');
const bodyParser = require('body-parser');

const tradesRoutes = require('../backend/routes/trades-routes');
const userRoutes = require('../backend/routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/trades/', tradesRoutes);
app.use('/api/users/', userRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Route not found", 404);
    throw error;
});

// middleware function containing 4 parameters are recognised as error functions
app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code  || 500).json({message: error.message || "An unknown error occur"});

});

app.listen(5000);