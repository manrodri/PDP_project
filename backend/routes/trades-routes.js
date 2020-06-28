const express = require('express');
const { check } = require('express-validator');

const tradesController = require('../controllers/trades-controllers');

const router = express.Router();

// routes
router.get('/:tId', tradesController.getTradesById);
router.get('/user/:uId', tradesController.getTradesByUserId);

router.post('/', [
    check('operation').not().isEmpty(),
    check('operation').matches('^bought$|^sold$'),
    check('units').isNumeric(),
    check('units').not().isEmpty(),
    check('unitPrice').isNumeric(),
    check('unitPrice').not().isEmpty()
], tradesController.createTrade);

router.patch('/:tId', [
    check('operation').not().isEmpty(),
    check('operation').matches('^bought$|^sold$'),
    check('units').isNumeric(),
    check('units').not().isEmpty(),
    check('unitPrice').isNumeric(),
    check('unitPrice').not().isEmpty()
], tradesController.updateTrade);
router.delete("/:tId", tradesController.deleteTrade);

module.exports = router;