const express = require('express');

const tradesController = require('../controllers/trades-controllers');

const router = express.Router();

// routes
router.get('/:tId', tradesController.getTradesById);
router.get('/user/:uId', tradesController.getTradesByUserId);
router.post('/', tradesController.createTrade);
router.patch('/:tId', tradesController.updateTrade);
router.delete("/:tId", tradesController.deleteTrade);

module.exports = router;