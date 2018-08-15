var express = require('express');
var router = express.Router();

// GET portfolio builder page
router.get('/', function(req, res) {
    res.render('portfoliobuilder', { title: 'Build portfolio - Miroctus' });
    // probably will store user info in a database in the future
});

router.get('/:portfolio', function(req, res) {
    console.log(portfolios[req.params.portfolio])
    res.send(portfolios[req.params.portfolio]);
});

const portfolios = {
    'conservative': {
        'cash': 'Cash: 5%',
        'stb': 'Short Term Bonds: 47%',
        'itb': 'Intermediate Term Bonds: 20%',
        'ltb': 'Long Term Bonds: 0%',
        'lcvs': 'Large Cap Value Stocks: 12%',
        'lcgs': 'Large Cap Growth Stocks: 7%',
        'mcs': 'Mid Cap Stocks: 0%',
        'scs': 'Small Cap Stocks: 4%',
        'ids': 'International Developed Stocks: 5%',
        'ies': 'International Emerging Stocks: 0%'
    },
    'moderately_conservative': {
        'cash': 'Cash: 4%',
        'stb': 'Short Term Bonds: 32%',
        'itb': 'Intermediate Term Bonds: 19%',
        'ltb': 'Long Term Bonds: 0%',
        'lcvs': 'Large Cap Value Stocks: 18%',
        'lcgs': 'Large Cap Growth Stocks: 13%',
        'mcs': 'Mid Cap Stocks: 0%',
        'scs': 'Small Cap Stocks: 5%',
        'ids': 'International Developed Stocks: 9%',
        'ies': 'International Emerging Stocks: 0%'
    },
    'moderate': {
        'cash': 'Cash: 4%',
        'stb': 'Short Term Bonds: 22%',
        'itb': 'Intermediate Term Bonds: 13%',
        'ltb': 'Long Term Bonds: 0%',
        'lcvs': 'Large Cap Value Stocks: 24%',
        'lcgs': 'Large Cap Growth Stocks: 15%',
        'mcs': 'Mid Cap Stocks: 0%',
        'scs': 'Small Cap Stocks: 8%',
        'ids': 'International Developed Stocks: 10%',
        'ies': 'International Emerging Stocks: 0%'
    },
    'moderately_aggressive': {
        'cash': 'Cash: 2%',
        'stb': 'Short Term Bonds: 8%',
        'itb': 'Intermediate Term Bonds: 8%',
        'ltb': 'Long Term Bonds: 0%',
        'lcvs': 'Large Cap Value Stocks: 30%',
        'lcgs': 'Large Cap Growth Stocks: 21%',
        'mcs': 'Mid Cap Stocks: 0%',
        'scs': 'Small Cap Stocks: 13%',
        'ids': 'International Developed Stocks: 12%',
        'ies': 'International Emerging Stocks: 6%'
    },
    'aggressive': {
        'cash': 'Cash: 0%',
        'stb': 'Short Term Bonds: 0%',
        'itb': 'Intermediate Term Bonds: 0%',
        'ltb': 'Long Term Bonds: 0%',
        'lcvs': 'Large Cap Value Stocks: 36%',
        'lcgs': 'Large Cap Growth Stocks: 25%',
        'mcs': 'Mid Cap Stocks: 0%',
        'scs': 'Small Cap Stocks: 14%',
        'ids': 'International Developed Stocks: 17%',
        'ies': 'International Emerging Stocks: 8%'
    }
}

module.exports = router;