var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('calculator', { title: 'Investment calculator - Miroctus', headline: 'Calculate your financial future.' });
});

module.exports = router;