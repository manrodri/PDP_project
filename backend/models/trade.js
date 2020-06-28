const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    security_id: { type: String, required: true},
    user_id: { type: String, required: true},
    date: { type: Date, required: true},
    operation: { type: String, required: true},
    units: { type: Number, required: true},
    unitPrice: { type: Number, required: true},
    commission: { type: Number, required: true},
    tax: { type: Number, required: true}
});

module.exports = mongoose.model('trade', tradeSchema);