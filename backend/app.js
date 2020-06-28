const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

const username = 'trackApp';
const passwd = 'DU22S5ViBTcHCMN';
const dbname = 'stockTrackApp';
const url = `mongodb+srv://${username}:${passwd}@cluster0-itesb.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(url,  { useNewUrlParser: true,  useUnifiedTopology: true })
    .then(
        () => {
            app.listen(5000);
        }
    )
    .catch(
        err => {
            console.log(err);
        }
    )


// mongodb+srv://<username>:<password>@cluster0-itesb.mongodb.net/<dbname>?retryWrites=true&w=majority
// passwd: DU22S5ViBTcHCMN
// user: trackApp