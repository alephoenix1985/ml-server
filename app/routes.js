var express = require('express');

var router = express.Router();
var ctrlItem = require('./controllers/items');


router.get('/items', ctrlItem.search);
router.get('/items/:id', ctrlItem.get);

module.exports = router;
