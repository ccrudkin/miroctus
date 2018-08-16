var express = require('express');
var router = express.Router();
var portfolios = require('./routes_data/portfolio_profiles');

// GET portfolio builder page
router.get('/', function(req, res) {
    res.render('portfoliobuilder', { title: 'Build portfolio - Miroctus' });
});

router.get('/:portfolio', function(req, res) {
    console.log(portfolios[req.params.portfolio])
    res.send(portfolios[req.params.portfolio]);
});

module.exports = router;