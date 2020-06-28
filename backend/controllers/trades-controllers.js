const {uuid} = require('uuidv4');
const {validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Trade = require('../models/trade');

// DUMMY_TRADES

// let DUMMY_TRADES = [
//     {
//         id: 't1',
//         security_id: 's1',
//         user_id: 'u1',
//         date: myDate,
//         operation: 'bought',
//         units: 1987,
//         unitPrice: 2.56,
//         commission: 6,
//         tax: 30.34
//     },
//     {
//         id: 't2',
//         security_id: 's2',
//         user_id: 'u2',
//         date: myDate,
//         operation: 'sold',
//         units: 17,
//         unitPrice: 52.60,
//         commission: 50,
//         tax: 0
//     },
//     {
//         id: 't1',
//         security_id: 's2',
//         user_id: 'u1',
//         date: myDate,
//         operation: 'bought',
//         units: 97,
//         unitPrice: 45.32,
//         commission: 6,
//         tax: 30.34
//     }
// ]


const getTradesById = async (req, res, next) => {
    const tradeId = req.params.tId;

    let trade;
    try {
     trade =  await Trade.findById(tradeId);
    } catch (e) {
        const error = new HttpError("Something went wrong, could not find a trade", 500);
        return next(error)
    }
    if (!trade) {
        return next(new HttpError("Could not find a trade for the provided id", 404));
    }

    res.json({trade: trade.toObject( { getters: true }) });  // {trade: trade}
}

const getTradesByUserId = async (req, res, next) => {
    const userId = req.params.uId;
    let trades;
    try{
        trades = await Trade.find({ user_id: userId })
    } catch (e) {
        return next(new HttpError("Something went wrong, could not find a trade. Please try again", 500));
    }

    if (!trades || trades.length === 0) {
        return next(new HttpError("Could not find a trade for the provided user id", 404));
    }

    return res.json({ trades: trades.map(p => p.toObject({ getters: true })) })
}

const createTrade = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        return next(new HttpError("Invalid input passed, please check your data", 422));
    }
    const {operation, units, unitPrice, commission, tax} = req.body;

    const myDate = new Date();
    const security_id = 's3';
    const user_id = 'u2';

    const newTrade = new Trade({
        security_id,
        user_id,
        date: myDate,
        operation,
        units,
        unitPrice,
        commission,
        tax
    });

    try {
        await newTrade.save();
    } catch (err) {
        const error = new HttpError("Creating trade failed, please try again", 500);
    }

    res.status(201).json({trade: newTrade.toObject({ getters: true })});
}

const updateTrade = async (req, res, next) => {
    console.log('Got here')
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError("Invalid input passed, please check your data", 422));
    }

    const {operation, units, unitPrice, commission, tax} = req.body;
    // todo: calculate commision and tax
    const tradeId = req.params.tId;

    let trade;
    try{
        trade = await Trade.findById(tradeId);
    } catch (e) {
        console.log(e);
        const error = new HttpError("Something went wrong, could not update trade for the provided trade id", 500);
        return next(error);
    }

    trade.operation = operation;
    trade.units = units;
    trade.unitPrice = unitPrice;
    trade.commission = commission;
    trade.tax = tax;

    try {
        await trade.save();
    } catch (e) {
        console.log(e)
        const error = new HttpError("Something went wrong, could not update trade", 500);
        return next(error);
    }

    res.status(201).json({trade: trade.toObject({ getters: true })});

}

const deleteTrade = async (req, res, next) => {
    const tradeId = req.params.tId;

    let trade;
    try{
        trade = await Trade.findById(tradeId);
    } catch (e) {
        console.log(e);
        const error = new HttpError("Something went wrong, could not delete trade for the provided trade id", 500);
        return next(error);
    }

    try{
        await trade.remove();
    } catch (e) {
        console.log(e);
        const error = new HttpError("Something went wrong, could not delete trade for the provided trade id", 500);
        return next(error);
    }


    res.status(200).json({});
}

exports.getTradesById = getTradesById;
exports.getTradesByUserId = getTradesByUserId;
exports.createTrade = createTrade;
exports.updateTrade = updateTrade;
exports.deleteTrade = deleteTrade;