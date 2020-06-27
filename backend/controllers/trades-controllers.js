const {uuid} = require('uuidv4');

const HttpError = require('../models/http-error');

// DUMMY_TRADES
const myDate = new Date();
let DUMMY_TRADES = [
    {
        id: 't1',
        security_id: 's1',
        user_id: 'u1',
        date: myDate,
        operation: 'bought',
        units: 1987,
        unitPrice: 2.56,
        commission: 6,
        tax: 30.34
    },
    {
        id: 't2',
        security_id: 's2',
        user_id: 'u2',
        date: myDate,
        operation: 'sold',
        units: 17,
        unitPrice: 52.60,
        commission: 50,
        tax: 0
    },
    {
        id: 't1',
        security_id: 's2',
        user_id: 'u1',
        date: myDate,
        operation: 'bought',
        units: 97,
        unitPrice: 45.32,
        commission: 6,
        tax: 30.34
    }
]


const getTradesById = (req, res, next) => {
    const tradeId = req.params.tId;
    const trade = DUMMY_TRADES.find(t => {
        return t.id === tradeId;
    });

    if (!trade) {
        return next(new HttpError("Could not find a trade for the provided id", 404));
    }

    res.json({trade});  // {trade: trade}
}

const getTradesByUserId = (req, res, next) => {
    const userId = req.params.uId;
    const userTrades = DUMMY_TRADES.filter((trade, index, trades) => {
        return trade.user_id === userId;
    });

    if (!userTrades || userTrades.length === 0) {
        return next(new HttpError("Could not find a trade for the provided user id", 404));
    }

    return res.json({userTrades})
}

const createTrade = (req, res, next) => {
    const {security_id, user_id, operation, units, unitPrice, commission, tax} = req.body;

    const newTrade = {
        id: uuid(),
        security_id,
        user_id,
        date: myDate,
        operation,
        units,
        unitPrice,
        commission,
        tax
    }

    DUMMY_TRADES.push(newTrade);
    res.status(201).json({newTrade});
}

const updateTrade = (req, res, next) => {
    const {operation, units, unitPrice, commission, tax} = req.body;
    const tradeId = req.params.tId;

    const updatedTrade = {...DUMMY_TRADES.find(t => t.id === tradeId)};
    const tradeIndex = DUMMY_TRADES.findIndex(t => t.id === tradeId);

    updatedTrade.commission = commission;
    updatedTrade.units = units;
    updatedTrade.tax = tax;
    updatedTrade.unitPrice = unitPrice;
    updatedTrade.operation = operation;

    DUMMY_TRADES[tradeIndex] = updatedTrade;

    res.status(201).json({updatedTrade});

}

const deleteTrade = (req, res, next) => {
    const tradeId = req.params.tId;
    DUMMY_TRADES = DUMMY_TRADES.filter(t => t.id !== tradeId);

    res.status(200).json({});
}

exports.getTradesById = getTradesById;
exports.getTradesByUserId = getTradesByUserId;
exports.createTrade = createTrade;
exports.updateTrade = updateTrade;
exports.deleteTrade = deleteTrade;